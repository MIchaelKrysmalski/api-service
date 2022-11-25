import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

  @Column()
  public currentHashedRefreshToken?: string;
}