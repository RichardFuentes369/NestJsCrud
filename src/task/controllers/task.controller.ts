import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';

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
    getTasks(@Query() query, @Headers() headers) {
        if (query.page && query.perPage) {
            return this.taskService.getTasksDb(query.page, query.sort, query.perPage);
        }
        return this.taskService.errorParams();
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