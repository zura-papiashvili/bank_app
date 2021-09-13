import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../modules/users/users.module';
import { JwtSecret } from './password.const';
import { JwtStrategy } from './auth-jwt.strategy';
import { RolesGuard } from './roles.guard';
import { CompaniesModule } from 'src/modules/companies/companies.module';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    UsersModule,
    CompaniesModule,
    PassportModule,
    JwtModule.register({
      secret: JwtSecret.secret,
      signOptions: { expiresIn: '1200m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
