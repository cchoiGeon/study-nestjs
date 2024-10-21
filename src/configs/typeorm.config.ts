import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { BoardEntity } from "src/board/board.entitiy";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'choegeon',
    password: '11111111',
    database: 'test',
    entities: [BoardEntity],
    synchronize: true,
}