import { Injectable, Logger } from '@nestjs/common';

import { GetAllServiceDTO } from 'src/dto/service-get-all.dto';
import { UpdateServiceDTO } from 'src/dto/service-update.dto';
import { CreateServiceDTO } from 'src/dto/services-create.dto';

import { Services } from 'src/interface/services.interface';
import { ServicesMysqlRepository } from 'src/repositories/services-mysql/services-mysql.repository';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly serviceRepository: ServicesMysqlRepository) {}

  async createService(data: CreateServiceDTO): Promise<Services> {
    try {
      const newService = await this.serviceRepository.createService(data);
      return newService;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async getServices(query: GetAllServiceDTO): Promise<Services[]> {
    try {
      const service = await this.serviceRepository.getServices(query);

      return service;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async updateService(id: number, data: UpdateServiceDTO) {
    try {
      const service = await this.serviceRepository.updateService(id, data);

      return service;
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }

  async deleteServiceById(id: number) {
    try {
      return await this.serviceRepository.deleteServiceById(id);
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
  async getServiceById(id: number): Promise<Services[]> {
    try {
      return await this.serviceRepository.getServiceById(id);
    } catch (error) {
      this.logger.log(`error: ${error.message}`);
      return null;
    }
  }
}
