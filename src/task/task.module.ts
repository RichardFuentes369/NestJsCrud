import { Module } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity'

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TypeOrmModule.forFeature([Task])],
  exports: [TypeOrmModule]
})
export class TaskModule { }
