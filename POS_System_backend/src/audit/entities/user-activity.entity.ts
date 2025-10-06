import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_activities')
export class UserActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  userName: string;

  @Column()
  userRole: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  entityType?: string;

  @Column({ nullable: true })
  entityId?: number;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}