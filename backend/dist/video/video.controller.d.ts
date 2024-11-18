import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update-video.dto';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    findAll(): string;
    findOne(id: string): any;
    update(id: string, updateVideoDto: UpdateVideoDto): boolean;
    remove(id: string): string;
}
