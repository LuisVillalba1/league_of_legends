import {DynamicModule} from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config/dist"
import {DataSourceOptions} from "typeorm"

import { Enviroment } from "src/common/enums/enviroment.enum"

export const databaseProvide : DynamicModule = TypeOrmModule.forRootAsync({
    inject : [ConfigService],
    async useFactory(config : ConfigService){
        const isDevelopmentEnv = config.get("DB_ENV") !== Enviroment.Production

        const dbConfig= {
            type : "mysql",
            host : config.get("DB_HOST"),
            port : + config.get("DB_PORT"),
            username : config.get("DB_USER"),
            password : config.get("DB_PASSWORD"),
            database : config.get("DB_NAME"),
            synchronize : isDevelopmentEnv,
            entities : [],
            autoLoadEntities : true,
            logging : config.get("DB_LOGGIN")
        } as DataSourceOptions
        return dbConfig
    }
})