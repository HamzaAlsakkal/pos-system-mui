import { Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "./dto/update-user.dto";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { fullName, username, email, password, role } = createUserDto;
    console.log(createUserDto)
    const userExists = await this.userRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('Username already exists');
    }
    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
        fullName,
        username,
        email,
        password:hashedPassword,
        role:role ?? UserRole.CASHIER,
    });
    return this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async getByEmail(email:string){
    const user = await this.userRepository.findOne({ where: { email } });
    return user
  }
  
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { fullName, username, email, password, role } = updateUserDto;
    const userExists = await this.userRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('Username already exists');
    }
    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    const user = await this.getUserById(id);
    user.fullName = fullName ?? user.fullName;
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.role = role ?? user.role;
    return this.userRepository.save(user);
  }

  async updatePassword(id:number, hashedNewPassword:string):Promise<User>{
    const user = await this.userRepository.findOne({ where: { id } });
    if(!user){
      throw new NotFoundException("User not found!")
    }
    user.password = hashedNewPassword
    return this.userRepository.save(user);
  }
  
  async delete(id:number){
    const userExists = await this.userRepository.findOne({where:{id}})
    if(!userExists){
      throw new NotFoundException('User Not Found!')
    }
    await this.userRepository.delete(id)
    return {"success":"User was Deleted Successfully!"}
  }
}