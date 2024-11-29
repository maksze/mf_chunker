import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  question!: string;
}