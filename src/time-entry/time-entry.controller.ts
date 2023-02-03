import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
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
    @UseGuards(AccessTokenGuard)
    createTimeEntry(
        @Param('userId') userId: number,
        @Body() timeEntryDto: CreateTimeEntryDto
    ): Promise<{ startTime: Date; endTime: Date; description: string; user: import("/home/michael/michael/projects/bachelorarbeit/api-service/src/user/entities/user.entity").User; currentMonth: number; currentWeek: number; type: string; project: import("/home/michael/michael/projects/bachelorarbeit/api-service/src/Projects/entities/project.entity").Project; timeSpent: number; } & import("/home/michael/michael/projects/bachelorarbeit/api-service/src/time-entry/entities/timeEntry.entity").TimeEntry> {
        return this.timeEntryService.createTimeEntry(userId, timeEntryDto);
    }

    @Get(':userId')
    @UseGuards(AccessTokenGuard)
    getTimeEntrysByUser(@Param('userId') userId: number) {
        return this.timeEntryService.getTimeEntryByUser(userId);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    getTimeEntrys() {
        return this.timeEntryService.getAll();
    }

    @Patch(':userId')
    @UseGuards(AccessTokenGuard)
    updateTimeEntryFromUser(
        @Param('userId') userId: number,
        @Body() updateTimeEntryDto: UpdateTimeEntryDto
        ) {
            return this.timeEntryService.updateTimeEntryFromUser(userId, updateTimeEntryDto);
    }

    @Delete(':userId')
    @UseGuards(AccessTokenGuard)
    deleteTimeEntryFromUser(
        @Param('userId') userId: number, 
        @Query('timeEntryId') timeEntryId: number) {
            return this.timeEntryService.deletTimeEntry(userId,timeEntryId);
    }
}
