import { Controller, Get, Headers, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('/api/user')
export class UserController {

    constructor(private userService: UserService) { }

    /*
       *Por peticion a bd
    */
    @Get('/')
    getTasks(@Query() query, @Headers() headers) {
        if (query.page && query.perPage) {
            return this.userService.getUserTask(query.page, query.sort, query.perPage);
        }
        return this.userService.errorParams();
    }

}
