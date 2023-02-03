import { IsString, IsDate, IsOptional, IsEmail, IsNotEmpty, IsInt } from 'class-validator';
export class UpdateTimeEntryDto {
    @IsInt()
    @IsNotEmpty()
    id: number
    
    @IsDate()
    @IsNotEmpty()
    startTime: Date;
    
    @IsDate()
    @IsNotEmpty()
    endTime: Date;

    @IsString()
    timeSpent: number;
    
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    description: string;
}