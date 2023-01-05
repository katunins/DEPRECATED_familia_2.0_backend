import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RelativesService } from './relatives.service';
import { Relative, RelativeSchema } from './schemas/relative.schema';
import { RelativesController } from './relatives.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import Config from 'src/config';

@Module({
  providers: [RelativesService, UsersService],
  controllers: [RelativesController],
  imports: [
    JwtModule.register({secret: Config.jwtSecret}),
    MongooseModule.forFeature([
      { name: Relative.name, schema: RelativeSchema },
    ]),
    forwardRef(() => UsersModule)
  ],
})
export class RelativesModule {
}
