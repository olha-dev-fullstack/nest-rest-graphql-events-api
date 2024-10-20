import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { UserDoesNotExistConstraint } from './validation/user-does-not-exist.contraint';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthResolver,
    UserDoesNotExistConstraint,
  ],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
