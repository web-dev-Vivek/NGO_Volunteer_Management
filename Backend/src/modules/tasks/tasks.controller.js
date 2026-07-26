import Task from '../../models/Task.js';
import Campaign from '../../models/Campaign.js';
import User from '../../models/User.js';

// @desc    Assign Task to Volunteer
// @route   POST /api/tasks
// @access  Private (Coordinator/Admin)
export const createTask = async (req, res, next) => {
    try {
        const { title, description, campaignId, assignedVolunteer, dueDate, priority } = req.body;

        // Validation
        if (!title || !description || !campaignId || !assignedVolunteer || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, description, campaignId, assignedVolunteer, dueDate'
            });
        }

        // Verify volunteer exists
        const volunteer = await User.findById(assignedVolunteer);
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Assigned volunteer not found'
            });
        }

        // Verify campaign exists
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found'
            });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            campaignId,
            assignedVolunteer,
            assignedBy: req.user.id,
            status: 'pending',
            priority: priority || 'medium',
            dueDate,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Tasks based on User Role
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
    try {
        let query = { isDeleted: { $ne: true } };

        if (req.user.role === 'admin') {
            // Admin sees all tasks
        } else if (req.user.role === 'coordinator') {
            // Coordinator sees tasks they assigned or tasks belonging to campaigns they created
            const myCampaigns = await Campaign.find({ createdBy: req.user.id });
            const campaignIds = myCampaigns.map(c => c._id);

            query.$or = [
                { assignedBy: req.user.id },
                { campaignId: { $in: campaignIds } }
            ];
        } else {
            // Volunteers (or other users) see only their assigned tasks
            query.assignedVolunteer = req.user.id;
        }

        const tasks = await Task.find(query)
            .populate('assignedVolunteer', 'firstName lastName email phone')
            .populate('campaignId', 'title description location category')
            .populate('assignedBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Task Configuration
// @route   PUT /api/tasks/:taskId
// @access  Private (Coordinator/Admin)
export const updateTask = async (req, res, next) => {
    try {
        const { title, description, campaignId, assignedVolunteer, dueDate, priority } = req.body;
        const task = await Task.findOne({ _id: req.params.taskId, isDeleted: { $ne: true } });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Validate volunteer if changing
        if (assignedVolunteer && assignedVolunteer !== task.assignedVolunteer.toString()) {
            const volunteer = await User.findById(assignedVolunteer);
            if (!volunteer) {
                return res.status(404).json({
                    success: false,
                    message: 'Assigned volunteer not found'
                });
            }
            task.assignedVolunteer = assignedVolunteer;
        }

        // Validate campaign if changing
        if (campaignId && campaignId !== task.campaignId.toString()) {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                return res.status(404).json({
                    success: false,
                    message: 'Campaign not found'
                });
            }
            task.campaignId = campaignId;
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (priority) task.priority = priority;
        task.updatedAt = new Date();

        await task.save();

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle Task Status
// @route   PUT /api/tasks/:taskId/status
// @access  Private (Volunteer/Coordinator/Admin)
export const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide task status'
            });
        }

        const allowedStatuses = ["pending", "in-progress", "completed", "verified", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
            });
        }

        const task = await Task.findOne({ _id: req.params.taskId, isDeleted: { $ne: true } });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Authorization check: Only assigned volunteer or coordinator/admin can update status
        const isAssignedVolunteer = task.assignedVolunteer.toString() === req.user.id;
        const isPrivilegedUser = ['coordinator', 'admin'].includes(req.user.role);

        if (!isAssignedVolunteer && !isPrivilegedUser) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task status'
            });
        }

        task.status = status;
        task.updatedAt = new Date();

        await task.save();

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};
