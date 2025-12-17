import { Module } from '@nestjs/common';
import { MetabaseService } from './metabase.service';
import { MetabaseController } from './metabase.controller';
import { JwtModule } from '@nestjs/jwt';
import { metabaseConfig } from 'config/env';

@Module({
  imports: [
    JwtModule.register({
      secret: metabaseConfig.secret,
      signOptions: { expiresIn: '10m' }, // duración del token
    }),
  ],
  controllers: [MetabaseController],
  providers: [MetabaseService],
})
export class MetabaseModule {}
