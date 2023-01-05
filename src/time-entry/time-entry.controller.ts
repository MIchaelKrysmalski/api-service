import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTimeEntryDto } from './dtos/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dtos/update-time-entry.dto';
import { TimeEntryService } from './time-entry.service';

@ApiTags('time-entry')
@Controller('time-entry')
export class TimeEntryController {
    constructor(
        private readonly timeEntryService: TimeEntryService
        ) { }
    @Post(':userId')
    @UseGuards(JwtAuthGuard)
    createTimeEntry(
        @Param('userId') userId: number,
        @Body() timeEntryDto: CreateTimeEntryDto
    ) {
        return this.timeEntryService.createTimeEntry(userId, timeEntryDto);
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard)
    getTimeEntrysByUser(@Param('userId') userId: number) {
        return this.timeEntryService.getTimeEntryByUser(userId);
    }

    @Patch(':userId')
    @UseGuards(JwtAuthGuard)
    updateTimeEntryFromUser(
        @Param('userId') userId: number,
        @Body() updateTimeEntryDto: UpdateTimeEntryDto
        ) {
            return this.timeEntryService.updateTimeEntryFromUser(userId, updateTimeEntryDto);
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard)
    deleteTimeEntryFromUser(
        @Param('userId') userId: number, 
        @Query('timeEntryId') timeEntryId: number) {
            return this.timeEntryService.deletTimeEntry(userId,timeEntryId);
    }
}
