import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GetAllServiceDTO } from 'src/dto/service-get-all.dto';
import { UpdateServiceDTO } from 'src/dto/service-update.dto';
import { CreateServiceDTO } from 'src/dto/services-create.dto';
import { ServiceEntity } from 'src/entities/services.entity';

import { Services } from 'src/interface/services.interface';

import { Repository } from 'typeorm/repository/Repository';
import { getConnection } from 'typeorm';
@Injectable()
export class ServicesMysqlRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}
  async createService(data: CreateServiceDTO): Promise<Services> {
    try {
      const newService = new ServiceEntity();
      newService.name = data.name;
      newService.type = data.type;
      newService.company = data.company;
      newService.account = data.account;
      const createdService = await this.serviceRepository.save(newService);
      return {
        id: newService.id,
        type: newService.type,
        company: newService.company,
        account: newService.account,
        name: newService.name,
      };
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async getServices(query: GetAllServiceDTO): Promise<Services[]> {
    const queryBuilder = this.serviceRepository.createQueryBuilder();
    queryBuilder.where('isDeleted=false');
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

    const services = result.map((service) => ({
      id: service.id,
      type: service.type,
      company: Number(service.company),
      account: Number(service.account),
      name: service.name,
    }));
    return services;
  }
  async getServiceById(id: number): Promise<Services[]> {
    try {
      const queryBuilder = this.serviceRepository.createQueryBuilder();
      queryBuilder.where('id = :id', { id }).andWhere('isDeleted=false');
      queryBuilder.loadAllRelationIds();

      const services = await queryBuilder.getMany();
      const serviceById = services.map((service) => ({
        id: service.id,
        type: service.type,
        company: Number(service.company),
        account: Number(service.account),
        name: service.name,
      }));

      if (serviceById.length > 0) {
        return serviceById;
      }
      throw new Error("couldn't find service with given id");
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async updateService(id: number, data: UpdateServiceDTO) {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .update(ServiceEntity)
        .set(data)
        .where('id = :id', { id: id })
        .andWhere('isDeleted = false')
        .execute();

      if (result.affected == 1) {
        const updated = await this.serviceRepository.findOne(id);
        return updated;
      }

      throw new Error("couldn't update service with given id");
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async deleteServiceById(id: number) {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .update(ServiceEntity)
        .set({ isDeleted: true })
        .where('id = :id', { id: id })
        .andWhere('isDeleted = false')
        .execute();

      if (result.affected == 1) {
        const updated = await this.serviceRepository.findOne(id);
        return updated;
      }

      throw new Error("couldn't delete service with given id");
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
}
