import {
  Body,
  Delete,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetAllServiceDTO } from 'src/dto/service-get-all.dto';
import { UpdateServiceDTO } from 'src/dto/service-update.dto';
import { CreateServiceDTO } from 'src/dto/services-create.dto';
import { UserEnum } from 'src/enums/user-role.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly ServicesService: ServicesService) {}

  @Post()
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createService(@Body() body: CreateServiceDTO) {
    try {
      const newService = await this.ServicesService.createService(body);
      if (newService) {
        return getSuccessMessage(newService);
      } else {
        return getErrorMessage("Service wasn't created");
      }
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getServices(@Query() query: GetAllServiceDTO) {
    try {
      const services = await this.ServicesService.getServices(query);
      return getSuccessMessage(services);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateService(@Param('id') id: number, @Body() data: UpdateServiceDTO) {
    try {
      const result = await this.ServicesService.updateService(id, data);
      if (result) {
        return getSuccessMessage(result);
      } else {
        return getErrorMessage("service wasn't updated");
      }
    } catch (err) {
      return getErrorMessage('Could Not Update Information !');
    }
  }
  @Delete(':id')
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async deleteServiceById(@Param('id') id: number) {
    try {
      const result = await this.ServicesService.deleteServiceById(id);
      if (result) {
        return getSuccessMessage(result);
      } else {
        return getErrorMessage("service wasn't deleted");
      }
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getServicesById(@Param('id') idNumber: number) {
    try {
      const service = await this.ServicesService.getServiceById(idNumber);

      if (service) {
        return getSuccessMessage(service);
      } else {
        return getErrorMessage("Service couldn't be found with given id");
      }
    } catch (error) {
      return getErrorMessage("Service couldn't be found with given id");
    }
  }
}
