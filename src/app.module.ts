import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    BoardModule,
    AuthModule,
  ],
})
export class AppModule {}
