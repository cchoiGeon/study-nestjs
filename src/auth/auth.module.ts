import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user.entity';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { GoogleStrategy } from './google.strategy';

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions:{
        expiresIn: jwtConfig.expiresIn,
      }
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,GoogleStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
