import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/entities/services.entity';
import { ServicesMysqlRepository } from './services-mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  providers: [ServicesMysqlRepository],
  exports: [ServicesMysqlRepository],
})
export class ServicesMysqlModule {}
