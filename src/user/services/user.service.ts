import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    errorParams() {
        throw new NotFoundException(`Esta ruta requiere los parametros page, perPage como datos obligatorios y sort como opcional`);
    }

    async getUserTask(page: number, sort: any, perPage: number): Promise<{}> {
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
          * Hago la consulta de los usuarios y las tareas, ordeno por id y pagino  
          * Consulta la cantidad de registros que tiene la tabla y lo guarda en la variable totalRecords
          * Saco las paginas totales con respecto a los registos de la base de datos y la cantidad de registros que voy a mostrar por pagina (machetazo, lo aproximo al numero siguiente)
          * Armo la respuesta
          */

        const [querydata] = await this.userRepository.findAndCount({
            relations: ['tasks'],
            order: {
                id: sort
            },
            skip: (page - 1) * perPage,
            take: perPage
        })

        let totalRecords = await this.userRepository.count()

        let totalPages = Math.ceil(totalRecords / perPage);

        let response = {
            data: querydata,
            currentPage: page,
            perPage: perPage,
            prevPage: (page == 1) ? null : page - 1,
            nextPage: (page == totalPages) ? null : parseInt(page as any) + 1,
            totalPages: totalPages,
            totalRecords: totalRecords,
            sort: sort
        }

        return response;
    };

}
