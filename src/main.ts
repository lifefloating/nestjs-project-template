import * as dotenv from 'dotenv';

dotenv.config();

import compression from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { FastifyInstance } from 'fastify';
import * as yaml from 'js-yaml';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create Fastify-based NestJS application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Get application configuration
  const configService = app.get(ConfigService);
  const appConfig = configService.getAppConfig();
  logger.log(`Application configuration: ${JSON.stringify(appConfig)}`);
  const port = appConfig.port;
  const host = appConfig.host;
  const apiPrefix = appConfig.apiPrefix;
  const swaggerConfig = configService.getSwaggerConfig();

  app.setGlobalPrefix(apiPrefix as string, {
    exclude: swaggerConfig?.path
      ? [swaggerConfig.path, 'openapi.json', 'openapi.yaml']
      : ['openapi.json', 'openapi.yaml'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Setup global request validation
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  // cause fastify update, temp adapt
  const fastifyInstance = app.getHttpAdapter().getInstance() as unknown as FastifyInstance;

  await fastifyInstance.register(compression as any);
  await fastifyInstance.register(helmet as any);
  await fastifyInstance.register(fastifyCors as any, configService.getCorsConfig());

  // Register multipart plugin for file uploads with configuration from storage settings
  await fastifyInstance.register(fastifyMultipart as any, {
    limits: {
      fileSize: configService.getStorageConfig().maxFileSize,
      files: 1,
    },
    attachFieldsToBody: false,
  });

  // Setup Swagger API documentation
  if (swaggerConfig?.enabled) {
    const apiDocVersion = process.env.API_DOC_VERSION || swaggerConfig?.version || '1.0.0';

    // Generate Swagger OpenAPI document
    const options = new DocumentBuilder()
      .setOpenAPIVersion(swaggerConfig?.openApiVersion || '3.1.0')
      .setTitle(swaggerConfig?.title || 'API Documentation')
      .setDescription(swaggerConfig?.description || 'API Documentation Description')
      .addBearerAuth()
      .setVersion(apiDocVersion)
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig?.path || 'apidoc', app, document);

    // Add YAML format OpenAPI document endpoint
    fastifyInstance.get('/openapi.yaml', (_, reply) => {
      reply.header('Content-Type', 'text/yaml');
      reply.send(yaml.dump(document));
    });

    logger.log(`Swagger documentation available at /${swaggerConfig?.path || 'apidoc'}`);
    logger.log(`OpenAPI YAML available at /openapi.yaml`);
  }

  // Start the application
  await app.listen(port ?? 7009, host ?? 'localhost');
  const appUrl = await app.getUrl();
  logger.log(`Application is running on: ${appUrl}`);

  if (swaggerConfig?.enabled) {
    const swaggerPath = swaggerConfig?.path || 'apidoc';
    logger.log(`Swagger API documentation available at: ${appUrl}/${swaggerPath}`);
    logger.log(`OpenAPI JSON available at: ${appUrl}/openapi.json`);
    logger.log(`OpenAPI YAML available at: ${appUrl}/openapi.yaml`);
  }
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error(`Failed to start application: ${err.message}`, err.stack);
  process.exit(1);
});
