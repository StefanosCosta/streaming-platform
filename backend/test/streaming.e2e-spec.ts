import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('StreamingController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  const testContentIds: string[] = [];

  // Helper function to generate JWT token
  const generateTestToken = (
    payload = { sub: 'test-user-id', username: 'testuser' },
  ): string => {
    return jwtService.sign(payload);
  };

  // Helper function to generate token with wrong secret
  const generateInvalidToken = (): string => {
    return jwt.sign(
      { sub: 'test-user-id', username: 'testuser' },
      'wrong-secret-key',
    );
  };

  // Helper function to generate expired token
  const generateExpiredToken = (): string => {
    return jwtService.sign(
      { sub: 'test-user-id', username: 'testuser' },
      { expiresIn: '-1h' },
    );
  };

  // Helper function to generate malformed token
  const generateMalformedToken = (): string => {
    return 'not.a.valid.jwt.token';
  };

  // Test data factory
  const createValidContent = () => ({
    title: 'Test Movie',
    description: 'A test movie description',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    videoUrl: 'https://example.com/video.mp4',
    year: 2024,
    genre: 'Test',
    rating: 8.5,
    duration: 120,
    cast: ['Actor 1', 'Actor 2'],
  });

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
    jwtService = app.get<JwtService>(JwtService);
    await app.init();

    // Generate auth token for protected routes
    authToken = generateTestToken();
  });

  afterAll(async () => {
    // Clean up test content
    if (testContentIds.length > 0) {
      await prismaService.streamingContent.deleteMany({
        where: {
          id: {
            in: testContentIds,
          },
        },
      });
    }
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

  describe('/api/streaming (POST)', () => {
    describe('with valid JWT', () => {
      it('should create streaming content successfully', async () => {
        const newContent = createValidContent();

        const response = await request(app.getHttpServer())
          .post('/api/streaming')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newContent)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newContent.title);
        expect(response.body.description).toBe(newContent.description);
        expect(response.body.year).toBe(newContent.year);
        expect(response.body.rating).toBe(newContent.rating);

        // Store ID for cleanup
        testContentIds.push(response.body.id);
      });

      it('should validate required fields', async () => {
        const invalidContent = {
          title: '',
          description: 'Test',
          // Missing required fields
        };

        await request(app.getHttpServer())
          .post('/api/streaming')
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidContent)
          .expect(400);
      });

      it('should validate URL formats', async () => {
        const invalidContent = {
          ...createValidContent(),
          thumbnailUrl: 'not-a-url',
          videoUrl: 'also-not-a-url',
        };

        await request(app.getHttpServer())
          .post('/api/streaming')
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidContent)
          .expect(400);
      });

      it('should validate year range', async () => {
        const invalidContent = {
          ...createValidContent(),
          year: 1800, // Before 1900
        };

        await request(app.getHttpServer())
          .post('/api/streaming')
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidContent)
          .expect(400);
      });

      it('should validate rating range', async () => {
        const invalidContent = {
          ...createValidContent(),
          rating: 11, // Above 10
        };

        await request(app.getHttpServer())
          .post('/api/streaming')
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidContent)
          .expect(400);
      });
    });

    describe('without JWT', () => {
      it('should return 401 unauthorized', async () => {
        const newContent = createValidContent();

        await request(app.getHttpServer())
          .post('/api/streaming')
          .send(newContent)
          .expect(401);
      });
    });
  });

  describe('/api/streaming/:id (PUT)', () => {
    let contentIdForUpdate: string;

    beforeAll(async () => {
      // Create content to update
      const newContent = createValidContent();
      const response = await request(app.getHttpServer())
        .post('/api/streaming')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newContent)
        .expect(201);

      contentIdForUpdate = response.body.id;
      testContentIds.push(contentIdForUpdate);
    });

    describe('with valid JWT', () => {
      it('should update content successfully', async () => {
        const updatedData = {
          title: 'Updated Test Movie',
          description: 'Updated description',
          thumbnailUrl: 'https://example.com/updated-thumbnail.jpg',
          videoUrl: 'https://example.com/updated-video.mp4',
          year: 2025,
          genre: 'Updated Genre',
          rating: 9.0,
          duration: 150,
          cast: ['Updated Actor 1', 'Updated Actor 2'],
        };

        const response = await request(app.getHttpServer())
          .put(`/api/streaming/${contentIdForUpdate}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updatedData)
          .expect(200);

        expect(response.body.title).toBe(updatedData.title);
        expect(response.body.description).toBe(updatedData.description);
        expect(response.body.year).toBe(updatedData.year);
        expect(response.body.rating).toBe(updatedData.rating);
      });

      it('should allow partial updates', async () => {
        const partialUpdate = {
          title: 'Partially Updated Title',
        };

        const response = await request(app.getHttpServer())
          .put(`/api/streaming/${contentIdForUpdate}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(partialUpdate)
          .expect(200);

        expect(response.body.title).toBe(partialUpdate.title);
        // Other fields should remain unchanged
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('year');
      });

      it('should return 404 for non-existent content', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';
        const updateData = { title: 'Should not work' };

        await request(app.getHttpServer())
          .put(`/api/streaming/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(404);
      });

      it('should validate data on update', async () => {
        const invalidUpdate = {
          rating: 15, // Invalid rating
        };

        await request(app.getHttpServer())
          .put(`/api/streaming/${contentIdForUpdate}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(invalidUpdate)
          .expect(400);
      });
    });

    describe('without JWT', () => {
      it('should return 401 unauthorized', async () => {
        const updateData = { title: 'Should fail' };

        await request(app.getHttpServer())
          .put(`/api/streaming/${contentIdForUpdate}`)
          .send(updateData)
          .expect(401);
      });
    });
  });

  describe('/api/streaming/:id (DELETE)', () => {
    let contentIdForDelete: string;

    beforeEach(async () => {
      // Create content to delete
      const newContent = createValidContent();
      const response = await request(app.getHttpServer())
        .post('/api/streaming')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newContent)
        .expect(201);

      contentIdForDelete = response.body.id;
    });

    describe('with valid JWT', () => {
      it('should delete content successfully', async () => {
        await request(app.getHttpServer())
          .delete(`/api/streaming/${contentIdForDelete}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        // Verify deletion
        await request(app.getHttpServer())
          .get(`/api/streaming/${contentIdForDelete}`)
          .expect(404);
      });

      it('should return 404 for non-existent content', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000';

        await request(app.getHttpServer())
          .delete(`/api/streaming/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });

      it('should return 404 when deleting already deleted content', async () => {
        // Delete once
        await request(app.getHttpServer())
          .delete(`/api/streaming/${contentIdForDelete}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        // Try to delete again
        await request(app.getHttpServer())
          .delete(`/api/streaming/${contentIdForDelete}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });

    describe('without JWT', () => {
      it('should return 401 unauthorized', async () => {
        await request(app.getHttpServer())
          .delete(`/api/streaming/${contentIdForDelete}`)
          .expect(401);
      });
    });
  });

  describe('JWT Authentication Security', () => {
    const testEndpoint = '/api/streaming';
    let testData: any;

    beforeAll(() => {
      testData = createValidContent();
    });

    describe('Invalid JWT Tokens', () => {
      it('should reject malformed token', async () => {
        const malformedToken = generateMalformedToken();

        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Bearer ${malformedToken}`)
          .send(testData)
          .expect(401);
      });

      it('should reject token with wrong signature', async () => {
        const invalidToken = generateInvalidToken();

        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Bearer ${invalidToken}`)
          .send(testData)
          .expect(401);
      });

      it('should reject expired token', async () => {
        const expiredToken = generateExpiredToken();

        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Bearer ${expiredToken}`)
          .send(testData)
          .expect(401);
      });

      it('should reject random string as token', async () => {
        const randomToken = 'this-is-not-a-jwt-token-at-all';

        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Bearer ${randomToken}`)
          .send(testData)
          .expect(401);
      });

      it('should reject empty token', async () => {
        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', 'Bearer ')
          .send(testData)
          .expect(401);
      });
    });

    describe('Authorization Header Format', () => {
      it('should reject token without Bearer prefix', async () => {
        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', authToken) // Missing "Bearer "
          .send(testData)
          .expect(401);
      });

      it('should reject wrong auth scheme', async () => {
        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Basic ${authToken}`)
          .send(testData)
          .expect(401);
      });

      it('should reject malformed authorization header', async () => {
        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `InvalidFormat${authToken}`)
          .send(testData)
          .expect(401);
      });
    });

    describe('Token Payload Issues', () => {
      it('should reject token with empty payload', async () => {
        const emptyPayloadToken = jwtService.sign({});

        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Bearer ${emptyPayloadToken}`)
          .send(testData)
          .expect(401);
      });

      it('should reject token with missing sub field', async () => {
        const noSubToken = jwtService.sign({ username: 'testuser' });

        await request(app.getHttpServer())
          .post(testEndpoint)
          .set('Authorization', `Bearer ${noSubToken}`)
          .send(testData)
          .expect(401);
      });
    });

    describe('Security on all protected endpoints', () => {
      it('should reject invalid token on PUT endpoint', async () => {
        const invalidToken = generateInvalidToken();

        await request(app.getHttpServer())
          .put(`${testEndpoint}/00000000-0000-0000-0000-000000000000`)
          .set('Authorization', `Bearer ${invalidToken}`)
          .send({ title: 'Updated' })
          .expect(401);
      });

      it('should reject invalid token on DELETE endpoint', async () => {
        const invalidToken = generateInvalidToken();

        await request(app.getHttpServer())
          .delete(`${testEndpoint}/00000000-0000-0000-0000-000000000000`)
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);
      });
    });
  });

  describe('/api/streaming/:id/progress (PATCH)', () => {
    let contentIdForProgress: string;

    beforeAll(async () => {
      // Create content for progress updates
      const newContent = createValidContent();
      const response = await request(app.getHttpServer())
        .post('/api/streaming')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newContent)
        .expect(201);

      contentIdForProgress = response.body.id;
      testContentIds.push(contentIdForProgress);
    });

    it('should update watch progress for existing content', async () => {
      const progressData = { watchProgress: 67.5 };

      const response = await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(200);

      expect(response.body).toHaveProperty('id', contentIdForProgress);
      expect(response.body).toHaveProperty('watchProgress', 67.5);
    });

    it('should return 404 when updating progress for non-existent content', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const progressData = { watchProgress: 50 };

      await request(app.getHttpServer())
        .patch(`/api/streaming/${nonExistentId}/progress`)
        .send(progressData)
        .expect(404);
    });

    it('should return 400 when watchProgress is below 0', async () => {
      const progressData = { watchProgress: -10 };

      await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(400);
    });

    it('should return 400 when watchProgress is above 100', async () => {
      const progressData = { watchProgress: 150 };

      await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(400);
    });

    it('should not require authentication', async () => {
      const progressData = { watchProgress: 25 };

      // No Authorization header - should still work
      const response = await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(200);

      expect(response.body).toHaveProperty('watchProgress', 25);
    });

    it('should reject extra fields in payload', async () => {
      const progressData = {
        watchProgress: 50,
        extraField: 'should be rejected',
      };

      await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(400);
    });

    it('should update progress to 0', async () => {
      const progressData = { watchProgress: 0 };

      const response = await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(200);

      expect(response.body).toHaveProperty('watchProgress', 0);
    });

    it('should update progress to 100', async () => {
      const progressData = { watchProgress: 100 };

      const response = await request(app.getHttpServer())
        .patch(`/api/streaming/${contentIdForProgress}/progress`)
        .send(progressData)
        .expect(200);

      expect(response.body).toHaveProperty('watchProgress', 100);
    });
  });
});