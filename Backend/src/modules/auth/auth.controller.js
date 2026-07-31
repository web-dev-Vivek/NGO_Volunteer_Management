// Authentication controllers
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary,deleteFromCloudinary } from '../../utils/cloudinaryupload.js';


export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ success: true, token, data: user });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ success: true, token, data: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        next(error);
    }
};



// Get current logged-in user
export const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
};

// Update Profile
export const updateProfile = async (req, res, next) => {
    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            bio,
            skills,
            availability,
            organization,
            experience,
        } = req.body;


        const user = await User.findById(req.user._id);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.firstName = firstName ?? user.firstName;
        user.lastName = lastName ?? user.lastName;
        user.email = email ?? user.email;
        user.phone = phone ?? user.phone;
        user.bio = bio ?? user.bio;
        user.skills = skills ?? user.skills;
        user.availability = availability ?? user.availability;
        user.organization = organization ?? user.organization;
        user.experience = experience ?? user.experience;

        await user.save();


        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};


// Upload Avatar
  export const uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }  
        const user = await User.findById(req.user._id);

         if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        if(user.profileImagePublicId){
            await deleteFromCloudinary(user.profileImagePublicId);
        }
        const   result =  await uploadToCloudinary(req.file.buffer,   "ngo-volunteer-management/avatars");
        
       
       
        user.profileImage = result.secure_url;
        user.profileImagePublicId = result.public_id;

        await user.save();

        res.status(200).json({
            success: true,
            message: "profile image  uploaded successfully",
            data: user,
        });

    }catch (error) {
        next(error);
    }}