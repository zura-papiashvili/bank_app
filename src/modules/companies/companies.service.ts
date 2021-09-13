import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from 'src/dto/create-company.dto';
import { GetAllCompaniesDto } from 'src/dto/get-all-companies.dto';
import { UpdateCompanyDto } from 'src/dto/update-company.dto';
import { CompaniesRepoService } from 'src/repositories/companies-repo/companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companyRepository: CompaniesRepoService) {}

  async createCompany(data: CreateCompanyDto) {
    return await this.companyRepository.createCompany(data);
  }

  async getCompany(id: number) {
    return await this.companyRepository.getCompany(id);
  }

  async getAllCompanies(data: GetAllCompaniesDto) {
    return await this.companyRepository.getAllCompanies(data);
  }

  async updateCompany(id: number, data: UpdateCompanyDto) {
    return await this.companyRepository.updateCompany(id, data);
  }

  async deleteCompany(id: number) {
    return await this.companyRepository.deleteCompany(id);
  }
}
