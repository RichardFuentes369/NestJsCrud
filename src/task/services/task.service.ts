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

    errorParams() {
        throw new NotFoundException(`Esta ruta requiere los parametros page, perPage como datos obligatorios y sort como opcional`);
    }

    async getTasksDb(page: number, sort: any, perPage: number): Promise<{}> {

        /**
         * Valido que El atributo pagina sea un numero positivo
         * Valido que el atributo perPage sea un numero positivo
         * Valido que el sort sea un string con condicion asc o desc
         */

        if (isNaN(page) || page <= 0) throw new NotFoundException(`
            El parametro ingresado en la ruta con identificador page, solo recibe numeros enteros positivos mayores a 0 
        `);

        if (isNaN(perPage) || perPage <= 0) throw new NotFoundException(`
            El parametro ingresado en la ruta con identificador perPage, solo recibe numeros enteros positivos mayores a 0 
        `);

        if (sort) {
            if (sort != 'asc' && sort != 'desc') throw new NotFoundException(`
                El parametro ingresado en la ruta con identificador sort, solo recibe palabras asc para ordenar ascendentemente o desc para ordenar descendentemente
            `);
        }

        /**
         * Instancio el modelo y lo guardo en la variable query  
         * Consulta la cantidad de registros que tiene la tabla y lo guarda en la variable totalRows
         * Saco las paginas totales con respecto a los registos de la base de datos y la cantidad de registros que voy a mostrar por pagina (machetazo, lo aproximo al numero siguiente)
         * Ordeno por id
         * Armo la respuesta
         */

        let query = this.taskRepository.createQueryBuilder('task');

        let totalRecords = await query.getCount()

        let totalPages = Math.ceil(totalRecords / perPage);

        if (sort) {
            query.orderBy('task.id', sort.toUpperCase())
        }

        let response = {
            data: await query.offset((page - 1) * perPage).limit(perPage).getMany(),
            currentPage: page,
            perPage: perPage,
            prevPage: (page == 1) ? null : page - 1,
            nextPage: (page == totalPages) ? null : parseInt(page as any) + 1,
            totalPages: totalPages,
            totalRecords: totalRecords,
            sort: sort
        }

        return response;

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