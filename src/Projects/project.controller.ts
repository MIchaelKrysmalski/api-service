import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ProjectDto } from "./dtos/project.dto";
import { ProjectService } from "./project.service";

@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() projectDto: ProjectDto
    ) {
        return this.projectService.create(projectDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getProjects() {
        return this.projectService.getAllProjects();
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    updateProjects() {

    }
}