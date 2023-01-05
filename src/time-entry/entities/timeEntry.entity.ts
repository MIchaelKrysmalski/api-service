import { Project } from "src/Projects/entities/project.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TimeEntry{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    startTime: Date;

    @Column({nullable: true})
    endTime: Date;

    @Column()
    currentMonth: number;

    @Column()
    currentWeek: number;

    @Column()
    type: string;

    @Column({nullable: true})
    description: string;

    @Column({ nullable: true})
    timeSpent: number;

    @Column({ nullable: true})
    break: number;

    @ManyToOne(() => Project, (project) => project.timeEntries)
    project: Project;

    @ManyToOne(() => User, (user) => user.timeEntries)
    user: User
}