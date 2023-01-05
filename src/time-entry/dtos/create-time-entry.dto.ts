import { IsString, IsDate, IsOptional, IsEmail, IsNotEmpty, IsInt } from 'class-validator';
export class CreateTimeEntryDto {
    
    taskId: number;

    startTime: Date;
    
    endTime: Date;
    
    @IsString()
    @IsOptional()
    description: string;
}