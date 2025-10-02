import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create new user
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, username, name, password } = createUserDto;

    if (!email || !username || !name || !password) {
      throw new ConflictException('Missing required fields');
    }

    // check if password is strong enough
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ConflictException('Password is not strong enough');
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ConflictException('Invalid email');
    }

    // Check if email or username already exists
    const existing = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      throw new ConflictException('Email or username already exists');
    }

    // Create and save user (password will be hashed automatically by pre-save hook)
    const user = new this.userModel({ email, username, name, password });
    return user.save();
  }

  // update user (only name, profilePicture, bio)
  async update(
    id: string,
    updateUserDto: Partial<Pick<User, 'name' | 'profilePicture' | 'bio'>>,
  ): Promise<UserDocument | null> {
    // Pick only allowed fields
    const allowedUpdates: Partial<User> = {};
    if (updateUserDto.name) allowedUpdates.name = updateUserDto.name;
    if (updateUserDto.profilePicture)
      allowedUpdates.profilePicture = updateUserDto.profilePicture;
    if (updateUserDto.bio) allowedUpdates.bio = updateUserDto.bio;

    return this.userModel
      .findByIdAndUpdate(id, allowedUpdates, { new: true })
      .exec();
  }

  // Find user by name or username return all similars will be suggesvie search
  async findByNameOrUsername(query: string): Promise<UserDocument[]> {
    if (!query) return []; // return empty if no input

    // Matches any part of name or username (case-insensitive)
    const regex = new RegExp(query, 'i');

    return this.userModel
      .find({
        isDeleted: false,
        $or: [{ name: regex }, { username: regex }],
      })
      .select('name username profilePicture') // return only fields needed for suggestion
      .limit(10) // optional: limit number of suggestions
      .exec();
  }
}
