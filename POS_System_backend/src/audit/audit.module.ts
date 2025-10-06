import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { UserActivity } from './entities/user-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity])],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}