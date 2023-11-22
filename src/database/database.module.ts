import { Module } from '@nestjs/common';
import { databaseProvide } from './database.provider';

@Module({
    imports : [databaseProvide],
    exports : [databaseProvide]
})
export class DatabaseModule {}
