import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('StreamingService', () => {
  let service: StreamingService;

  const mockPrismaService = {
    streamingContent: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockContent = {
    id: 'test-id-123',
    title: 'Test Movie',
    description: 'Test description',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    videoUrl: 'https://example.com/video.mp4',
    year: 2024,
    genre: 'Action',
    rating: 8.5,
    duration: 120,
    cast: ['Actor 1', 'Actor 2'],
    watchProgress: 0,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StreamingService>(StreamingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new streaming content', async () => {
      const createDto = {
        title: 'Test Movie',
        description: 'Test description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        videoUrl: 'https://example.com/video.mp4',
        year: 2024,
        genre: 'Action',
        rating: 8.5,
        duration: 120,
        cast: ['Actor 1', 'Actor 2'],
      };

      mockPrismaService.streamingContent.create.mockResolvedValue(mockContent);

      const result = await service.create(createDto);

      expect(result).toEqual(mockContent);
      expect(mockPrismaService.streamingContent.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          watchProgress: 0,
        },
      });
    });

    it('should throw BadRequestException when creation fails', async () => {
      const createDto = {
        title: 'Test Movie',
        description: 'Test description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        videoUrl: 'https://example.com/video.mp4',
        year: 2024,
        genre: 'Action',
        rating: 8.5,
        duration: 120,
        cast: ['Actor 1', 'Actor 2'],
      };

      mockPrismaService.streamingContent.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of streaming content', async () => {
      const mockContentArray = [mockContent];
      mockPrismaService.streamingContent.findMany.mockResolvedValue(
        mockContentArray,
      );

      const result = await service.findAll();

      expect(result).toEqual(mockContentArray);
      expect(mockPrismaService.streamingContent.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no content exists', async () => {
      mockPrismaService.streamingContent.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single streaming content by id', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(
        mockContent,
      );

      const result = await service.findOne('test-id-123');

      expect(result).toEqual(mockContent);
      expect(mockPrismaService.streamingContent.findUnique).toHaveBeenCalledWith(
        {
          where: { id: 'test-id-123' },
        },
      );
    });

    it('should throw NotFoundException when content not found', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Content with ID non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update a streaming content', async () => {
      const updateDto = {
        title: 'Updated Title',
        description: 'Updated description',
        thumbnailUrl: 'https://example.com/updated-thumb.jpg',
        videoUrl: 'https://example.com/updated-video.mp4',
        year: 2024,
        genre: 'Drama',
        rating: 9.0,
        duration: 135,
        cast: ['Actor 1', 'Actor 2', 'Actor 3'],
      };
      const updatedContent = { ...mockContent, ...updateDto };

      mockPrismaService.streamingContent.findUnique.mockResolvedValue(
        mockContent,
      );
      mockPrismaService.streamingContent.update.mockResolvedValue(
        updatedContent,
      );

      const result = await service.update('test-id-123', updateDto);

      expect(result).toEqual(updatedContent);
      expect(mockPrismaService.streamingContent.update).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException when updating non-existent content', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(null);

      const updateDto = {
        title: 'Updated Title',
        description: 'Updated description',
        thumbnailUrl: 'https://example.com/updated-thumb.jpg',
        videoUrl: 'https://example.com/updated-video.mp4',
        year: 2024,
        genre: 'Drama',
        rating: 9.0,
        duration: 135,
        cast: ['Actor 1'],
      };

      await expect(
        service.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a streaming content', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(
        mockContent,
      );
      mockPrismaService.streamingContent.delete.mockResolvedValue(mockContent);

      const result = await service.remove('test-id-123');

      expect(result).toEqual({
        message: 'Content with ID test-id-123 has been deleted',
      });
      expect(mockPrismaService.streamingContent.delete).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
      });
    });

    it('should throw NotFoundException when deleting non-existent content', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProgress', () => {
    it('should update watch progress for existing content', async () => {
      const updatedContent = { ...mockContent, watchProgress: 45.5 };

      mockPrismaService.streamingContent.findUnique.mockResolvedValue(
        mockContent,
      );
      mockPrismaService.streamingContent.update.mockResolvedValue(
        updatedContent,
      );

      const result = await service.updateProgress('test-id-123', 45.5);

      expect(result).toEqual(updatedContent);
      expect(mockPrismaService.streamingContent.update).toHaveBeenCalledWith({
        where: { id: 'test-id-123' },
        data: { watchProgress: 45.5 },
      });
    });

    it('should throw NotFoundException when updating progress for non-existent content', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProgress('non-existent-id', 50),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when update fails', async () => {
      mockPrismaService.streamingContent.findUnique.mockResolvedValue(
        mockContent,
      );
      mockPrismaService.streamingContent.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.updateProgress('test-id-123', 50)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});