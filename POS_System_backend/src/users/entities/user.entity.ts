import { Purchase } from "src/purchases/entities/purchase.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @Column()
  fullName: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Unique username',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: UserRole.CASHIER,
    description: 'User role in the system',
    enum: UserRole,
  })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiHideProperty()
  @Column()
  password: string;
  
  @ApiProperty({
    example: '2023-10-03T21:00:00.000Z',
    description: 'Date when the user was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-03T21:00:00.000Z',
    description: 'Date when the user was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => Sale, sale => sale.user)
  sales: Sale[];

  @ApiHideProperty()
  @OneToMany(()=> Purchase, purchase => purchase.user)
  purchases: Purchase[];
}