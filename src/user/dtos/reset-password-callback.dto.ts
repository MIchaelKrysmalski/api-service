import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsEmail, IsNotEmpty, IsInt } from 'class-validator';

export class ResetPasswordCallbackDto {
    
    @ApiProperty({
        type: String,
        description: "Needed for callback"
    })
    @IsString()
    newPassword: string;

    @ApiProperty({
        type: String,
        description: "Needed for callback"
    })
    @IsEmail()
    email: string;
}