import { Module } from '@nestjs/common';
import { ServicesMysqlModule } from 'src/repositories/services-mysql/services-mysql.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [ServicesMysqlModule],

  controllers: [ServicesController],
  providers: [ServicesService, ServicesController],
  exports: [ServicesController],
})
export class ServicesModule {}
