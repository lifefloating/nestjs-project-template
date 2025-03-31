import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import {
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import path from 'path';
import { CommonModule } from './common/common.module';
import { StorageModule } from './storage/storage.module';
import { LoggerModule } from './logger/logger.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang']),
        AcceptLanguageResolver,
      ],
    }),
    PrismaModule,
    CommonModule,
    UsersModule,
    StorageModule.register(),
    AuthModule.forRoot(),
    LoggerModule,
    StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
