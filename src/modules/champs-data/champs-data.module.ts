import { Module } from '@nestjs/common';
import { ChampsDataController } from './champs-data.controller';
import { ChampsDataService } from './champs-data.service';
import {TypeOrmModule} from "@nestjs/typeorm"
import { ChampsData } from './champsData.entity';

@Module({
  imports : [TypeOrmModule.forFeature([ChampsData])],
  controllers: [ChampsDataController],
  providers: [ChampsDataService]
})
export class ChampsDataModule {}
