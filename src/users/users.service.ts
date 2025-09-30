import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    // Create new user
    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const { email, username, name, password } = createUserDto;

        // Check if email or username already exists
        const existing = await this.userModel.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            throw new ConflictException('Email or username already exists');
        }

        // Create and save user (password will be hashed automatically by pre-save hook)
        const user = new this.userModel({ email, username, name, password });
        return user.save();
    }

    // Get all users
    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find({ isDeleted: false }).select('-password').exec();
    }

    // update user
    async update(id: string, updateUserDto: Partial<User>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }

    // Find user by email
    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    // Find user by username
    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }
}
