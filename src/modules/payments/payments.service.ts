import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDTO } from 'src/dto/payments-create.dto';
import { GetAllServiceDTO } from 'src/dto/service-get-all.dto';
import { CreateTransactionDTO } from 'src/dto/transaction-create.dto';
import { TransactionType } from 'src/enums/transaction-type.enum';

import { Payments } from 'src/interface/payments.interface';
import { AccountsMysqlRepository } from 'src/repositories/accounts-mysql/accounts-mysql.repository';
import { PaymentsMysqlRepository } from 'src/repositories/payments-mysql/payments-mysql.repository';
import { ServicesMysqlRepository } from 'src/repositories/services-mysql/services-mysql.repository';
import { TransactionsMysqlRepository } from 'src/repositories/transactions-mysql/transactions-mysql.repository';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly paymentRepository: PaymentsMysqlRepository,
    private readonly transactionRepository: TransactionsMysqlRepository,
    private readonly accountRepository: AccountsMysqlRepository,
    private readonly serviceRepository: ServicesMysqlRepository,
  ) {}

  async createPayment(
    data: CreatePaymentDTO,
    userId: number,
  ): Promise<Payments> {
    try {
      const isOwner = await this.accountRepository.checkAccountOwner(
        data.senderAccountId,
        userId,
      );
      if (!isOwner) {
        throw new Error('Wrong account information');
      }
      //shemovaimporto servici da amovigo accoundId
      const service = await this.serviceRepository.getServiceById(
        Number(data.serviceId),
      );
      if (!service) {
        throw new Error('could not find service with given id');
      }
      // //shevqmna tranzaqcia
      const newTransaction: CreateTransactionDTO = {
        type: TransactionType.Service,
        amount: data.amount,
        senderAccountId: data.senderAccountId,
        receiverAccountId: service[0].account,
      };

      const createTransaction =
        await this.transactionRepository.createTransaction(newTransaction);
      // ანგარიშების ბალანსირება

      await this.accountRepository.transactionBalancing(createTransaction);

      const newPayment = await this.paymentRepository.createPayment(data);
      return newPayment;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async getPayments(query: GetAllServiceDTO): Promise<Payments[]> {
    try {
      const payment = await this.paymentRepository.getPayments(query);

      return payment;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async getPaymentById(id: number): Promise<Payments[]> {
    try {
      return await this.paymentRepository.getPaymentById(id);
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
}
