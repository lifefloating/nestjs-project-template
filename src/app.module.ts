import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { MailerModule } from './mailer/mailer.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { StripeModule } from './stripe/stripe.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../i18n/'),
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
    LoggerModule,
    StripeModule,
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
