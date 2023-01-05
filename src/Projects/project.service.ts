import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectDto } from "./dtos/project.dto";
import { Project } from "./entities/project.entity";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) {}

    async create(projectDto: ProjectDto) {
        return this.projectRepository.save(projectDto);
    }
    
    async getAllProjects() {
        return this.projectRepository.find();
    }

    async getById(id: number) {
        return this.projectRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async updateProject(id: number, projectDto: ProjectDto) {
        let project = await this.projectRepository.findOne({
            where: {
                id: id,
            }
        });
        project = {
            ...project,
        }
    }
}