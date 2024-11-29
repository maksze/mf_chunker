import "reflect-metadata"
import { DataSource } from 'typeorm';
import { Video } from '../../entity/Video';

export const dataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Video],
  synchronize: true,
  logging: false,
});