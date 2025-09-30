import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('StreamingController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/api/streaming (GET)', () => {
    it('should return an array of streaming content', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/streaming')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('thumbnailUrl');
        expect(response.body[0]).toHaveProperty('videoUrl');
        expect(response.body[0]).toHaveProperty('year');
        expect(response.body[0]).toHaveProperty('genre');
        expect(response.body[0]).toHaveProperty('rating');
        expect(response.body[0]).toHaveProperty('duration');
        expect(response.body[0]).toHaveProperty('cast');
        expect(response.body[0]).toHaveProperty('watchProgress');
        expect(response.body[0]).toHaveProperty('createdAt');
      }
    });
  });

  describe('/api/streaming/:id (GET)', () => {
    it('should return a single streaming content by id', async () => {
      // First get all content to get a valid ID
      const allContent = await request(app.getHttpServer())
        .get('/api/streaming')
        .expect(200);

      if (allContent.body.length > 0) {
        const validId = allContent.body[0].id;

        const response = await request(app.getHttpServer())
          .get(`/api/streaming/${validId}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', validId);
        expect(response.body).toHaveProperty('title');
        expect(response.body).toHaveProperty('description');
      }
    });

    it('should return 404 for non-existent content', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .get(`/api/streaming/${nonExistentId}`)
        .expect(404);
    });
  });
});