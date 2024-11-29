import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  question!: string;

  @Column('json')
  extra!: any;

  @Column()
  name!: string;

  @Column({nullable: true })
  repetition?: string;

  @Column('datetime', {nullable: true })
  reviewedAt?: Date | null;
}