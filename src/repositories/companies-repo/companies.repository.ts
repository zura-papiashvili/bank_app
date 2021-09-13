import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyDto } from 'src/dto/create-company.dto';
import { UpdateCompanyDto } from 'src/dto/update-company.dto';
import { CompanyEntity } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import { GetAllCompaniesDto } from 'src/dto/get-all-companies.dto';
import { CompanyInterface } from 'src/interface/company.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class CompaniesRepoService {
  private readonly logger = new Logger(CompaniesRepoService.name);
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async createCompany(data: CreateCompanyDto): Promise<CompanyInterface> {
    try {
      const newCompany = new CompanyEntity();
      newCompany.companyName = data.companyName;
      newCompany.email = data.email;
      newCompany.user = data.userId;

      this.companyRepository.save(newCompany);
      this.logger.log(`Create COmpany ${newCompany}`);
      return newCompany;
    } catch (err) {
      this.logger.log(`Could Not Create Company`);
      return null;
    }
  }

  async getCompany(id: number): Promise<CompanyInterface> {
    try {
      const res = await this.companyRepository.findOne(id);
      this.logger.log(`Get Company By Id Number ${res}`);

      return res;
    } catch (err) {
      this.logger.log(`Could Not get Company By Id Number`);
      return null;
    }
  }

  async getAllCompanies(
    query: GetAllCompaniesDto,
  ): Promise<CompanyInterface[]> {
    const queryBuilder = this.companyRepository.createQueryBuilder();
    queryBuilder.where('isDeleted = false');
    if (query.limit) {
      const limit = Math.min(query.limit, 20);
      queryBuilder.limit(limit);

      const page = query.page ? query.page - 1 : 0;
      queryBuilder.offset(page * limit);
    } else {
      queryBuilder.limit(20);
    }

    const res = await queryBuilder.getMany();
    const company = res.map((company) => ({
      id: company.id,
      companyName: company.companyName,
      email: company.email,
      user: company.user,
    }));
    return company;
  }

  async updateCompany(
    id: number,
    data: UpdateCompanyDto,
  ): Promise<CompanyInterface> {
    try {
      await this.companyRepository.update(id, data);
      const result = await this.companyRepository.findOne(id);
      this.logger.log(`Company was Updated ${result}`);

      return result;
    } catch (err) {
      this.logger.log(`Company Could NOt update!`);
      return null;
    }
  }
  async deleteCompany(id: number): Promise<String> {
    try {
      await this.companyRepository.save({
        id,
        isDeleted: true,
      });
      this.logger.log(`Company was Deleted`);
      return 'Company was Deleted!';
    } catch (err) {
      this.logger.log(`Could NoT delete Company`);
      return null;
    }
  }
}
