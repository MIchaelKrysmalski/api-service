import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/accessToken.guard";
import { ProjectDto } from "./dtos/project.dto";
import { ProjectService } from "./project.service";

@Controller('project')
@UseGuards(AccessTokenGuard)
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService
    ) { }

    @Post()
    @UseGuards(AccessTokenGuard)
    create(
        @Body() projectDto: ProjectDto
    ) {
        console.log(projectDto);
        return this.projectService.create(projectDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    getProjects() {
        return this.projectService.getAllProjects();
    }

    @Patch()
    @UseGuards(AccessTokenGuard)
    updateProjects() {

    }
}