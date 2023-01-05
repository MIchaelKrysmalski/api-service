import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResetPasswordCallbackDto } from './dtos/reset-password-callback.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor( private readonly usersService: UserService) { }

    @Get(':id')
    @ApiCreatedResponse({ description: 'Get Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(JwtAuthGuard)
    async getById(@Param('id') id: number) {
        return this.usersService.getById(id); 
    }

    @Get()
    @ApiCreatedResponse({ description: 'Get Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(JwtAuthGuard)
    async getAllUsers(@Req() req){
        if(!req.user.isAdmin) {
            return [];
        }
        return this.usersService.getAllUsers(); 
        
    }
    @Get('reset/:email')
    @ApiCreatedResponse({ description: 'reset Sent Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    async resetPassword(@Param('email') email: string) {
        //validate if user with email exists
        const user = await this.usersService.getByEmail(email);
        if(user) {
            //send reset mail
        }
    }

    @Post('reset/:id')
    @ApiCreatedResponse({ description: 'Callback Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    resetPasswordcallback(
        @Param('id') id: number, 
        @Body() resetPasswordCallbackDto: ResetPasswordCallbackDto
        ) {
            //TODO
    }
}
