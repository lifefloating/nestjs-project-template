import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { StorageController } from './controllers/storage.controller';
import { AliOssStorageProvider } from './providers/alioss-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import type { StorageProvider } from './providers/storage.interface';
import { TencentCosStorageProvider } from './providers/tencentcos-storage.provider';
import { StorageService } from './services/storage.service';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {
  static register(): DynamicModule {
    return {
      module: StorageModule,
      providers: [
        {
          provide: 'STORAGE_PROVIDERS',
          useFactory: (configService: ConfigService) => {
            const storageConfig = configService.getStorageConfig();
            const providers: Record<string, StorageProvider> = {
              // 默认始终包含S3Provider
              s3: new S3StorageProvider(configService),
            };

            // 根据配置注入其他提供商
            if (storageConfig.provider === 'alioss') {
              providers.alioss = new AliOssStorageProvider(configService);
            }

            if (storageConfig.provider === 'tencentoss') {
              providers.tencentoss = new TencentCosStorageProvider(configService);
            }

            return providers;
          },
          inject: [ConfigService],
        },
        StorageService,
      ],
    };
  }
}
