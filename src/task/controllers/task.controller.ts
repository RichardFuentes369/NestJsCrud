import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateTaskDto } from '../dto/create-task.dto'

import { TaskInterface } from '../interfaces/TaskInterface'
import { TaskService } from '../services/task.service'


@Controller('/api/task')
export class TaskController {

    constructor(private taskService: TaskService) { }

    /*
        *Por peticion a bd
    */
    @Get('/')
    getTasks() {
        return this.taskService.getTasksDb();
    }

    @Get('/:taskId')
    getTask(@Param('taskId') taskId) {
        return this.taskService.getTaskDb(taskId);
    }

    @Post()
    create(@Body() task: CreateTaskDto): string {
        this.taskService.create(task);
        return `Creando la tarea ${task.title}`;
    }

    @Put(':id')
    edit(@Body() task: CreateTaskDto, @Param('id') id) {
        return this.taskService.update(task, id);
    }

    @Delete(':id')
    delete(@Param('id') id): string {
        this.taskService.remove(id)
        return `eliminando la tarea ${id}`
    }


}

/*

    @Get('/interface')
    getTasksI(): TaskInterface[] {
        return this.taskService.getTasksInterface();
    }

    @Get('/interface/:taskId')
    getTaskI(@Param('taskId') taskId: string) {
        return this.taskService.getTaskInterface(parseInt(taskId));
    }
    */