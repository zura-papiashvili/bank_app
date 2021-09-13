import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  Body,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreatePaymentDTO } from 'src/dto/payments-create.dto';
import { GetAllServiceDTO } from 'src/dto/service-get-all.dto';
import { UserEnum } from 'src/enums/user-role.enum';

import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly PaymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createPayment(@Body() body: CreatePaymentDTO, @Req() req) {
    try {
      const newPayment = await this.PaymentsService.createPayment(
        body,
        req.user.userId,
      );
      if (newPayment) {
        return getSuccessMessage(newPayment);
      } else {
        return getErrorMessage("Payment wasn't created");
      }
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Get()
  @Roles(UserEnum.Operator)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  async getPayments(@Query() query: GetAllServiceDTO) {
    try {
      const services = await this.PaymentsService.getPayments(query);
      return getSuccessMessage(services);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UsePipes(ValidationPipe)
  async getPaymentsById(@Param('id') id: number, @Req() req) {
    try {
      const service = await this.PaymentsService.getPaymentById(id);

      if (Number(service[0]['user']) !== req.user.userId) {
        return getErrorMessage('access denied');
      }

      if (service) {
        return getSuccessMessage(service);
      } else {
        return getErrorMessage("Payment couldn't be found with given id");
      }
    } catch (error) {
      return getErrorMessage("Payment couldn't be found with given id");
    }
  }
}
