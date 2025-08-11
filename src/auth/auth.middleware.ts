import { ConfigService } from '@app/config/config.service';
import { PrismaService } from '@app/prisma/prisma.service';
import type { NestMiddleware, OnModuleInit } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { BetterAuthOptions } from 'better-auth';
import {
  AUTH_ALLOWED_METHODS,
  AUTH_BYPASS_PATHS,
  AuthInstanceInjectKey,
  OAuthProviderType,
} from './auth.constant';
import { CreateAuth } from './auth.implement';
import type { InjectAuthInstance } from './auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware, OnModuleInit {
  private readonly logger = new Logger(AuthMiddleware.name);
  private authHandler: Awaited<ReturnType<typeof CreateAuth>>['handler'] | undefined;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PrismaService) private readonly prismaService: PrismaService,
    @Inject(AuthInstanceInjectKey)
    private readonly authInstance: InjectAuthInstance,
  ) {}

  async onModuleInit() {
    await this.initializeAuthHandler();
  }

  private async initializeAuthHandler() {
    try {
      const oauth = this.configService.getOAuthConfig();
      const providers = {} as NonNullable<BetterAuthOptions['socialProviders']>;

      // Get enabled providers
      const enabledProviders = oauth.providers
        .filter((provider) => provider.enabled)
        .map((provider) => provider.type);

      // Process each enabled provider
      for (const providerType of enabledProviders) {
        // Validate provider type
        const enumProviderType = this.getProviderType(providerType);
        if (!enumProviderType) continue;

        // Get provider config
        const config = oauth.secrets[providerType];
        if (!config || !config.clientId || !config.clientSecret) continue;

        // Add to providers with proper typecasting
        providers[providerType as keyof typeof providers] = {
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          ...Object.entries(config)
            .filter(([key]) => !['clientId', 'clientSecret'].includes(key))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        } as any; // Using any to bypass complex type intersection
      }

      const { handler, auth } = CreateAuth(providers, this.prismaService, this.configService);
      this.authHandler = handler;
      this.authInstance.set(auth);
    } catch (error) {
      this.logger.error(`Failed to initialize auth handler: ${error.message}`, error.stack);
      throw error;
    }
  }

  private getProviderType(typeString: string): OAuthProviderType | null {
    // Check if the string is a valid enum value
    return Object.values(OAuthProviderType).includes(typeString as OAuthProviderType)
      ? (typeString as OAuthProviderType)
      : null;
  }

  // NestJS middleware interface method
  use(req: any, res: any, next: () => void): void {
    if (!this.authHandler) {
      next();
      return;
    }

    // Get the URL from the request (supports both Express and Fastify)
    const url = req.originalUrl || req.url || '';

    if (AUTH_BYPASS_PATHS.some((path) => url.includes(path))) {
      next();
      return;
    }

    if (!AUTH_ALLOWED_METHODS.includes(req.method || '')) {
      next();
      return;
    }

    // Ensure originalUrl is available for the auth handler
    if (!req.originalUrl) {
      req.originalUrl = url;
    }

    // Call the better-auth handler and handle promise errors
    this.authHandler(req, res).catch((error) => {
      this.logger.error(`Auth handler error: ${error.message}`, error.stack);
      // throw it to trigger NestJS exception filters
      req.authError = error;
      if (error.critical) {
        throw error;
      }

      next();
    });
  }
}
