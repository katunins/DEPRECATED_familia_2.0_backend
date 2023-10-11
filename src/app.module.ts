import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import Config from './config';
import { UsersModule } from './users/users.module';
import { AppGuard } from './app.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from './users/users.service';
import { StorageController } from './storage/storage.controller';
import { MulterModule } from '@nestjs/platform-express';
import { RelativesModule } from './relatives/relatives.module';
import { NotesModule } from './notes/notes.module';
import { RelativesService } from './relatives/relatives.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RelativesModule,
    NotesModule,
    MongooseModule.forRoot(process.env.DB_URL),
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AppController, StorageController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
  ],
})
export class AppModule {}
