import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // Automatically adds createdAt & updatedAt
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string; // For login/display name

  @Prop({ required: true, lowercase: true })
  name: string; // Full name

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password!: string; // non-null assertion

  @Prop({ default: false })
  isVerified: boolean; // Email verification flag

  @Prop({ default: 'user' })
  role: string; // 'user', 'admin', etc.

  @Prop()
  profilePicture?: string; // Optional profile image URL

  @Prop()
  bio?: string;

  @Prop()
  lastLogin?: Date;

  // Optional: add soft-delete flag
  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ⚡ Pre-save hook to hash password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toObject', {
  transform: (_, ret: Record<string, any>) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.set('toJSON', {
  transform: (_, ret: Record<string, any>) => {
    delete ret.password;
    return ret;
  },
});
