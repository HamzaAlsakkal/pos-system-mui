import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivity } from './entities/user-activity.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: Repository<UserActivity>,
  ) {}

  async logUserActivity(
    user: User,
    action: string,
    entityType?: string,
    entityId?: number,
    details?: any
  ): Promise<UserActivity> {
    const activity = this.userActivityRepository.create({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action,
      entityType,
      entityId,
      details: details ? JSON.stringify(details) : undefined,
      ipAddress: undefined, // This would be populated from request in real implementation
      userAgent: undefined, // This would be populated from request in real implementation
    });

    return await this.userActivityRepository.save(activity);
  }

  async getUserActivityHistory(
    userId: number,
    limit: number = 50
  ): Promise<UserActivity[]> {
    return await this.userActivityRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async getSystemActivityHistory(
    limit: number = 100
  ): Promise<UserActivity[]> {
    return await this.userActivityRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  async getDashboardActivity(user: User): Promise<any> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Get today's activities for the user
    const todayActivities = await this.userActivityRepository
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId: user.id })
      .andWhere('activity.timestamp >= :start', { start: startOfDay })
      .andWhere('activity.timestamp <= :end', { end: endOfDay })
      .getCount();

    // Get most common actions by this user
    const commonActions = await this.userActivityRepository
      .createQueryBuilder('activity')
      .select('activity.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('activity.userId = :userId', { userId: user.id })
      .groupBy('activity.action')
      .orderBy('COUNT(*)', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      todayActivities,
      commonActions,
    };
  }
}