import { Injectable, NotFoundException } from '@nestjs/common';

/*Interface*/
import { TaskInterface } from '../interfaces/TaskInterface'

/*dto*/
import { CreateTaskDto } from '../dto/create-task.dto'

/*BD*/
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entity/task.entity'


@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }

    getTasksDb(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    async getTaskDb(id: number): Promise<Task> {
        if (isNaN(id)) throw new NotFoundException('El id debe se un numero');
        if (id <= 0) throw new NotFoundException('No se admiten valores negativos');

        const task = await this.taskRepository.findOne({
            where: { id: id },
        });

        if (!task) throw new NotFoundException('No se encontraron registros');

        return task;
    }

    async create(task: CreateTaskDto): Promise<Task> {
        const newTask = await this.taskRepository.save({
            title: task.title,
            description: task.description,
            done: task.done
        });
        return newTask;
    }

    async update(task: CreateTaskDto, id: number): Promise<void> {
        if (isNaN(id)) throw new NotFoundException('El id debe se un numero');
        if (id <= 0) throw new NotFoundException('No se admiten valores negativos');

        const record = await this.taskRepository.findOne({
            where: { id: id },
        });

        if (!record) throw new NotFoundException('No se encontraron registros');

        this.taskRepository.update(id, task)
    }


    async remove(id: string): Promise<void> {
        await this.taskRepository.delete(id);
    }

}


/*

    tasks: TaskInterface[] = [
        {
            id: 1,
            title: "Testing",
            description: "Testing tak description",
            done: true
        },
        {
            id: 2,
            title: "Testing",
            description: "Testing tak description",
            done: true
        },
        {
            id: 3,
            title: "Testing",
            description: "Testing tak description",
            done: true
        },
        {
            id: 4,
            title: "Testing",
            description: "Testing tak description",
            done: true
        }
    ];

    getTasksInterface(): TaskInterface[] {
        return this.tasks;
    }

    getTaskInterface(id: number): TaskInterface {
        return this.tasks.find(task => task.id === id);
    }
    */