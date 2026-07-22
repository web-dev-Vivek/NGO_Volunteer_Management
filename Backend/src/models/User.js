// User Model schema
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ['volunteer', 'coordinator', 'admin'], default: 'volunteer' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        bio: { type: String },
        skills: [{ type: String }],
        availability: [{ type: String }]
    },
    { timestamps: true }
);

// Encrypt password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
