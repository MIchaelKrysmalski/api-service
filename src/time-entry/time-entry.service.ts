import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { ignoreElements, NotFoundError } from 'rxjs';
import { Project } from 'src/Projects/entities/project.entity';
import { ProjectService } from 'src/Projects/project.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTimeEntryDto } from './dtos/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dtos/update-time-entry.dto';
import { TimeEntry } from './entities/timeEntry.entity';

@Injectable()
export class TimeEntryService {
    constructor(
        @InjectRepository(TimeEntry)
        private timeEntryRepository: Repository<TimeEntry>,
        private projectService: ProjectService,
        private readonly userSerivce: UserService
    ){ }

    async createTimeEntry(userId: number, timeEntryDto: CreateTimeEntryDto) {
        console.log(timeEntryDto);
        const user = await this.userSerivce.getById(userId);
        const project = await this.projectService.getById(timeEntryDto.taskId);
        const startDate = new Date();
        let currentMonth = startDate.getMonth() + 1
        const day  = startDate.getDate();
        let week = Math.ceil(day / 7);
        const start = new Date(timeEntryDto.startTime);
        const end = new Date(timeEntryDto.endTime);
        let timeSpent = Math.abs(start.getTime() - end.getTime()) ;
        const timeEntry = await this.timeEntryRepository.save({
            startTime: new Date(timeEntryDto.startTime),
            endTime: new Date(timeEntryDto.endTime),
            description: timeEntryDto.description,
            user: user,
            currentMonth: currentMonth,
            currentWeek: week,
            type: project.name,
            project: project,
            userId: userId,
            timeSpent: timeSpent / 60000
        });
        console.log(timeEntry);
        return timeEntry
    }

    async getAll() {
        return this.timeEntryRepository.find();
    }

    async getTimeEntryByUser(userId: number) {
        const user = await this.userSerivce.getById(userId)
        if(user)
        return user.timeEntries;
        throw new NotFoundException();
    }

    async updateTimeEntryFromUser(userId: number, updatetimeEntryDto: UpdateTimeEntryDto) {
        console.log(updatetimeEntryDto);
        const timeEntry = await this.timeEntryRepository.findOne({
            where: {
                id: updatetimeEntryDto.id
            }
        })
        const user = await this.userSerivce.getById(userId);
        if(timeEntry && user) {
            timeEntry.description = updatetimeEntryDto.description;
            timeEntry.timeSpent = updatetimeEntryDto.timeSpent;
            timeEntry.startTime = updatetimeEntryDto.startTime;
            timeEntry.endTime = updatetimeEntryDto.endTime;
            timeEntry.type = updatetimeEntryDto.name;
        }
        return this.timeEntryRepository.save(timeEntry);
    }

    async deletTimeEntry(userId: number, timeEntryId: number) {
        const timeEntry = this.timeEntryRepository.findOne({
            where: {
                id: timeEntryId
            }
        })
        if(timeEntry)
        return this.timeEntryRepository.delete(timeEntryId);
    }
}
