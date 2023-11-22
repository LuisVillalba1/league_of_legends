import { Module } from '@nestjs/common';
import { ChampsModule } from './modules/champs/champs.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';
import {ConfigModule} from "@nestjs/config"
import { ChampsDataModule } from './modules/champs-data/champs-data.module';
import { HabilidadesModule } from './modules/habilidades/habilidades.module';
@Module({
  imports: [ChampsModule,
    DatabaseModule,
    ConfigModule.forRoot({isGlobal : true}),
    ChampsDataModule,
    HabilidadesModule,
    ],
})
export class AppModule {
  static port : number;
  constructor(private readonly configService : ConfigService){
    AppModule.port = +this.configService.get("PORT")
  }
}
