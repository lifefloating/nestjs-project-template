import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './interfaces/config.interface';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get<T = any>(key: string): T {
    const value = this.configService.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key ${key} is undefined`);
    }
    return value;
  }

  getAppConfig() {
    return this.get<Config['app']>('app');
  }

  getOAuthConfig() {
    return this.get<Config['oauth']>('oauth');
  }
  getAuthConfig() {
    return this.get<Config['auth']>('auth');
  }
  getDatabaseConfig() {
    return this.get<Config['database']>('database');
  }

  getStorageConfig() {
    return this.get<Config['storage']>('storage');
  }

  getCorsConfig() {
    return this.get<Config['cors']>('cors');
  }

  getSwaggerConfig() {
    return this.get<Config['swagger']>('swagger');
  }

  getSecurityConfig() {
    return this.get<Config['security']>('security');
  }

  getDatadogConfig() {
    return this.get<Config['datadog']>('datadog');
  }

  getStripeConfig() {
    return this.get<Config['stripe']>('stripe');
  }
}
