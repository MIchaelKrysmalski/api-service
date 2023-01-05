import { IsString, IsDate, IsOptional, IsEmail, IsNotEmpty, IsInt } from 'class-validator';
export class UpdateTimeEntryDto {
    @IsInt()
    @IsNotEmpty()
    id: number
    
    @IsDate()
    @IsNotEmpty()
    endTime: Date;
    
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    description: string;
}