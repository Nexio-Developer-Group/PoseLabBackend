import { Types } from 'mongoose';

export interface UserData {
  _id: string | Types.ObjectId;
  username: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  profilePicture?: string;
  bio?: string;
  lastLogin?: Date;
  isDeleted: boolean;
}
