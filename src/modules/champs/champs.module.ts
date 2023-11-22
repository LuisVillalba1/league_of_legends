import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm"

import { ChampsController } from './champs.controller';
import { ChampsService } from './champs.service';
import { Champs } from './champs.entity';
import { ChampsData } from '../champs-data/champsData.entity';
import { Habilidades } from '../habilidades/habilidades.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Champs,ChampsData,Habilidades])],
  controllers: [ChampsController],
  providers: [ChampsService]
})
export class ChampsModule {}
