import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsEmail, IsNotEmpty, IsInt } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        type: String,
        description: "Email needed for Auth"
    })
    @IsEmail()
    email: string;
    
    @ApiProperty({
        type: String,
        description: "Firstname needed as data"
    })
    @IsString()
    firstname: string;
    
    @ApiProperty({
        type: String,
        description: "Lastname needed as data"
    })
    @IsString()
    lastname: string;
    
    @ApiProperty({
        type: String,
        description: "Password needed for Auth"
    })
    @IsString()
    password: string;
}