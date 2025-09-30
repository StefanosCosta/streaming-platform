import { StreamingService } from './streaming.service';
import { CreateStreamingContentDto } from './dto/create-streaming-content.dto';
import { UpdateStreamingContentDto } from './dto/update-streaming-content.dto';
export declare class StreamingController {
    private readonly streamingService;
    constructor(streamingService: StreamingService);
    create(createStreamingContentDto: CreateStreamingContentDto): Promise<{
        id: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        videoUrl: string;
        year: number;
        genre: string;
        rating: number;
        duration: number;
        cast: string[];
        watchProgress: number;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        videoUrl: string;
        year: number;
        genre: string;
        rating: number;
        duration: number;
        cast: string[];
        watchProgress: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        videoUrl: string;
        year: number;
        genre: string;
        rating: number;
        duration: number;
        cast: string[];
        watchProgress: number;
        createdAt: Date;
    }>;
    update(id: string, updateStreamingContentDto: UpdateStreamingContentDto): Promise<{
        id: string;
        title: string;
        description: string;
        thumbnailUrl: string;
        videoUrl: string;
        year: number;
        genre: string;
        rating: number;
        duration: number;
        cast: string[];
        watchProgress: number;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
