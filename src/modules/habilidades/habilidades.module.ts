import { Module } from '@nestjs/common';
import { HabilidadesController } from './habilidades.controller';
import { HabilidadesService } from './habilidades.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { Habilidades } from './habilidades.entity';
import { Champs } from '../champs/champs.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Habilidades,Champs])],
  controllers: [HabilidadesController],
  providers: [HabilidadesService]
})
export class HabilidadesModule {}
