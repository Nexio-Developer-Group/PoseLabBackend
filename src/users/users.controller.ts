// users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserData } from './interfaces/user-data.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1️⃣ Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserData> {
    const user = await this.usersService.create(createUserDto);
    // Return only safe fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    return result as UserData;
  }

  // 2️⃣ Update safe fields only: name, profilePicture, bio
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateUserDto: Partial<Pick<CreateUserDto, 'name'>> & {
      profilePicture?: string;
      bio?: string;
    },
  ): Promise<UserData | null> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser.toObject();
    return result as UserData;
  }

  // 3️⃣ Suggestive search by name or username
  @Get('search')
  async suggest(@Query('q') query: string): Promise<Partial<UserData>[]> {
    const users = await this.usersService.findByNameOrUsername(query);
    // Return only fields needed for suggestion
    return users.map((u) => ({
      _id: u._id,
      name: u.name,
      username: u.username,
      profilePicture: u.profilePicture,
    }));
  }
}
