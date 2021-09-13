import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/entities/payments.entity';
import { Payments } from 'src/interface/payments.interface';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePaymentDTO } from 'src/dto/payments-create.dto';
import { CreateTransactionDTO } from 'src/dto/transaction-create.dto';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { ServicesMysqlRepository } from '../services-mysql/services-mysql.repository';
import { TransactionController } from 'src/modules/transaction/transaction.controller';
import { AccountEntity } from 'src/entities/account.entity';
import { GetAllServiceDTO } from 'src/dto/service-get-all.dto';

@Injectable()
export class PaymentsMysqlRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly serviceRepository: ServicesMysqlRepository,
  ) {}

  async createPayment(data: CreatePaymentDTO): Promise<Payments> {
    try {
      // //shevamowmo tu emtxveva data.userId  === senderAccountId.userId
      // const queryBuilder = this.accountRepository.createQueryBuilder();
      // queryBuilder
      //   .where('id = :id', { id: data.senderAccountId })
      //   .andWhere('isDeleted=false')
      //   .andWhere('userId = :userId', { userId: data.userId });
      // const account = await queryBuilder.getOne();
      // if (!account) {
      //   throw new Error('Wrong account information');
      // }
      //shemovaimporto servici da amovigo accoundId
      // const service = await this.serviceRepository.getServiceById(
      //   Number(data.serviceId),
      // );
      // if (!service) {
      //   throw new Error('could not find service with given id');
      // }
      // //shevqmna tranzaqcia
      // const newTransaction: CreateTransactionDTO = {
      //   type: TransactionType.Service,
      //   amount: data.amount,
      //   senderAccountId: data.senderAccountId,
      //   receiverAccountId: service[0].account,
      // };
      // const createTransaction =
      //   await this.transactionController.createTransaction(
      //     newTransaction,
      //     data.userId,
      //   );
      // if (createTransaction.status === 'error') {
      //   throw new Error('could not crete transaction');
      // }
      // shevqmnat payment
      const newPayment = new PaymentEntity();
      newPayment.amount = Math.abs(data.amount);
      newPayment.time = new Date();
      newPayment.service = data.serviceId;
      newPayment.user = data.userId;
      const createdPayment = await this.paymentRepository.save(newPayment);
      return {
        id: newPayment.id,
        amount: newPayment.amount,
        time: newPayment.time,
        service: newPayment.service,
        user: newPayment.user,
      };
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async getPayments(query: GetAllServiceDTO): Promise<Payments[]> {
    const queryBuilder = this.paymentRepository.createQueryBuilder();
    if (query.sortBy) {
      queryBuilder.orderBy(query.sortBy, query.sortDir);
    }
    if (query.searchBy) {
      const column = Object.keys(query.searchBy)[0];
      queryBuilder.where(`${column} like :value`, {
        value: `%${query.searchBy[column]}%`,
      });
    }
    if (query.limit) {
      const limit = Math.min(query.limit, 25);
      queryBuilder.limit(limit);
      const page = query.page ? query.page - 1 : 0;
      queryBuilder.offset(page * limit);
    } else {
      queryBuilder.limit(25);
    }
    queryBuilder.loadAllRelationIds();
    const result = await queryBuilder.getMany();
    const payments = result.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      time: payment.time,
      service: Number(payment.service),
      user: Number(payment.user),
    }));
    return payments;
  }

  async getPaymentById(id: number): Promise<Payments[]> {
    try {
      const queryBuilder = this.paymentRepository.createQueryBuilder();
      queryBuilder.where('id = :id', { id });
      queryBuilder.loadAllRelationIds();

      const payments = await queryBuilder.getMany();
      const paymentById = payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        time: payment.time,
        service: Number(payment.service),
        user: Number(payment.user),
      }));
      if (paymentById.length > 0) {
        return paymentById;
      }
      throw new Error("couldn't find payment with given id");
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
}
