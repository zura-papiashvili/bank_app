import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCompanyDto } from 'src/dto/create-company.dto';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { GetAllCompaniesDto } from 'src/dto/get-all-companies.dto';
import { UpdateCompanyDto } from 'src/dto/update-company.dto';
import { UserEnum } from 'src/enums/user-role.enum';
import { CompaniesService } from './companies.service';
import { Query } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Controller('companies')
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);
  constructor(private readonly companyServise: CompaniesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createCompany(@Body() data: CreateCompanyDto) {
    try {
      const newCompany = await this.companyServise.createCompany(data);
      this.logger.log(`create Company ${newCompany}`);
      return getSuccessMessage(newCompany);
    } catch (err) {
      return getErrorMessage('COuld Not Create Company!');
    }
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getCompany(@Param('id') id: number) {
    try {
      const res = await this.companyServise.getCompany(id);

      this.logger.log(`Get One Company By Id Number ${res}`);
      return getSuccessMessage(res);
    } catch (err) {
      return getErrorMessage('Could Not Find Company with this id!');
    }
  }

  @Get()
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllCompanies(@Query() data: GetAllCompaniesDto) {
    try {
      const company = await this.companyServise.getAllCompanies(data);

      this.logger.log(`Get All Companies ${company}`);
      return getSuccessMessage(company);
    } catch (err) {
      return getErrorMessage('Could Not Find Companies !');
    }
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateCompany(@Param('id') id: number, @Body() data: UpdateCompanyDto) {
    try {
      const result = await this.companyServise.updateCompany(id, data);
      this.logger.log(`Update Company ${result}`);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could Not Update Information !');
    }
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deleteCompany(@Param('id') id: number) {
    try {
      const result = await this.companyServise.deleteCompany(Number(id));
      this.logger.log(`Delete Company ${result}`);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could Not Delete Company !');
    }
  }
}
