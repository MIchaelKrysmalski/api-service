import { TimeEntry } from "src/time-entry/entities/timeEntry.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public firstname: string;

  @Column()
  public lastname: string;

  @Column()
  public password: string;

  @Column()
  public isAdmin: boolean;

  @Column({nullable: true})
  public currentHashedRefreshToken?: string;

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.user, { cascade: true, eager: true, onDelete: "SET NULL" })
  timeEntries: TimeEntry[];
}