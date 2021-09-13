import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompaniesRepoService } from './companies.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity])
  ],
  providers: [CompaniesRepoService],
  exports: [CompaniesRepoService],
})
export class CompaniesRepositoryModule {}
