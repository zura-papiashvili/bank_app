import {
  Body,
  Controller,
  Get,
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { FillBalanceDTO } from 'src/dto/fill-balance.dto';
import { CreateTransactionDTO } from 'src/dto/transaction-create.dto';
import { GetAllTransactionsDTO } from 'src/dto/transactions-get-all.dto';
import { BalancingResponse } from 'src/enums/transaction-balancing.enum';
import { UserEnum } from 'src/enums/user-role.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createTransaction(@Body() data: CreateTransactionDTO, @Req() req) {
    try {
      const newTransaction = await this.transactionService.createTransaction(
        data,
        req.user.userId,
      );

      if (newTransaction) {
        if (newTransaction.message === BalancingResponse.NOMONEY) {
          return getErrorMessage(newTransaction.message);
        }
        return getSuccessMessage(newTransaction);
      } else {
        getErrorMessage('something went wrong');
      }
    } catch (error) {
      this.logger.log(`error: ${error.message}`);

      getErrorMessage('something went wrong');
    }
  }

  @Get('pending_transactions')
  // @Roles(UserEnum.Operator)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getPendingTransactions() {
    try {
      const pendingTransactions =
        await this.transactionService.getPendingTransactions();
      return getSuccessMessage(pendingTransactions);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Patch('confirm/:id')
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async confirmPendingTransactionById(@Param('id') id: number) {
    try {
      const message =
        await this.transactionService.confirmPendingTransactionById(id);
      this.logger.log(`confirm controller: ${message}`);
      return getSuccessMessage(message);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Patch('reject/:id')
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async rejectPendingTransactionById(@Param('id') id: number) {
    try {
      const message = await this.transactionService.rejectTransactionById(id);
      this.logger.log(`confirm controller: ${message}`);
      return getSuccessMessage(message);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Post('/balance/deposit')
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async depositIntoAccount(@Body() body: FillBalanceDTO) {
    try {
      const newDeposit = await this.transactionService.depositIntoAccount(body);
      newDeposit['info'] = 'Bank Operation';
      return getSuccessMessage(newDeposit);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }
  @Post('/balance/withdraw')
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async withdrawFromAccount(@Body() body: FillBalanceDTO) {
    try {
      const withdraw = await this.transactionService.withdrawFromAccount(body);
      if (withdraw) {
        withdraw['info'] = 'Bank Operation';
      }
      return withdraw
        ? getSuccessMessage(withdraw)
        : getErrorMessage('There Is NOT Enough Money!!!');
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Get()
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAllTransactions(@Query() query: GetAllTransactionsDTO) {
    try {
      const transactions = await this.transactionService.getAllTransactions(
        query,
      );
      return getSuccessMessage(transactions);
    } catch (error) {}
  }
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAllMyTransactions(
    @Query() query: GetAllTransactionsDTO,
    @Req() req,
  ) {
    try {
      const myId = req.user.userId;
      const transactions = await this.transactionService.getAllMyTransactions(
        query,
        myId,
      );
      return getSuccessMessage(transactions);
    } catch (error) {}
  }
}
