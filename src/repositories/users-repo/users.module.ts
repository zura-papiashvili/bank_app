import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UsersRepoService } from './users.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
],
    providers: [UsersRepoService],
    exports: [UsersRepoService],
})
export class UsersRepositoryModule {}
