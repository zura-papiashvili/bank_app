import {
  Body,
  Delete,
  Logger,
  Param,
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
import { CreateAccountDTO } from 'src/dto/account-create.dto';
import { GetAllAccountDTO } from 'src/dto/account-get-all.dto';
import { UserEnum } from 'src/enums/user-role.enum';
import { Account } from 'src/interface/account.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly accountService: AccountsService) {}
  @Get(':idNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAccountsByIdNumber(@Param('idNumber') idNumber: string) {
    try {
      const accounts = await this.accountService.getAccountsByIdNumber(
        idNumber,
      );
      this.logger.log(`account numbers: ${accounts}`);

      if (accounts) {
        return getSuccessMessage({ accounts: accounts });
      } else {
        return getErrorMessage("Accounts Couldn't be found");
      }
    } catch (error) {
      return getErrorMessage("Accounts Couldn't be found");
    }
  }

  @Post()
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createAccount(@Body() body: CreateAccountDTO) {
    try {
      const newAccount = await this.accountService.createAccount(body);
      if (newAccount) {
        return getSuccessMessage(newAccount);
      } else {
        return getErrorMessage("Account wasn't created");
      }
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Delete(':id')
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async deleteAccountById(@Param('id') id: number) {
    try {
      const result = await this.accountService.deleteAccountById(id);
      if (result) {
        return getSuccessMessage(result);
      } else {
        return getErrorMessage("Account wasn't deleted");
      }
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }

  @Get()
  @Roles(UserEnum.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAccounts(@Query() query: GetAllAccountDTO) {
    try {
      const accounts = await this.accountService.getAccounts(query);
      return getSuccessMessage(accounts);
    } catch (error) {
      return getErrorMessage(error.message);
    }
  }
  @Get('my/accounts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getMyAccounts(@Req() req) {
    try {
      const myId = req.user.userId;
      console.log(myId);
      const myAccounts = await this.accountService.getMyAccounts(myId);
      return getSuccessMessage(myAccounts);
    } catch (error) {
      return getErrorMessage('Something went wrong');
    }
  }
}
