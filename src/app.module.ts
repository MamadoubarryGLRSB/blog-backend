import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

import { ArticlesModule } from './articles/articles.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
  ],
})
export class AppModule {}
