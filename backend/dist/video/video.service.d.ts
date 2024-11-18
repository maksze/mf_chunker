import { UpdateVideoDto } from './dto/update-video.dto';
export declare class VideoService {
    findAll(): string;
    findOne(WORKING_DIR: string): any;
    update(WORKING_DIR: string, updateVideoDto: UpdateVideoDto): boolean;
    remove(id: number): string;
}
