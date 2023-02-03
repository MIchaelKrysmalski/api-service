import { TimeEntry } from "src/time-entry/entities/timeEntry.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true})
    workTime: number;

    @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.project, { cascade: true, eager: true, onDelete: "SET NULL" })
    timeEntries: TimeEntry[]    
}