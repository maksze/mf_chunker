import { join } from 'path';
import { writeFile, readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
// import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

const STATIC_DIR = join(__dirname, '..', '..', 'static');

@Injectable()
export class VideoService {
  // create(createVideoDto: CreateVideoDto) {
  //   return 'This action adds a new video';
  // }

  findAll() {
    return `This action returns all video`;
  }

  findOne(WORKING_DIR: string) {
    const filePath = join(STATIC_DIR, WORKING_DIR, 'data.json');

    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }

  update(WORKING_DIR: string, updateVideoDto: UpdateVideoDto) {
    const filePath = join(STATIC_DIR, WORKING_DIR, 'data.json');

    writeFile(filePath, JSON.stringify(updateVideoDto, null, 2), (err) => {
      if (err) {
        // Handle the error
        console.error('Error writing to file', err);
        return;
      }
      // Success message
      console.log('JSON data has been written to', filePath);
    });

    return true;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
