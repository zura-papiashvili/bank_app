import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesRepositoryModule } from 'src/repositories/companies-repo/companies.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [CompaniesRepositoryModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService, CompaniesModule]
})
export class CompaniesModule {}
