import { Injectable,NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"

import { ChampsData } from './champsData.entity';
import { InsertChampData } from './dto/insertChamp-data.dto';
import { UpdataChampData } from './dto/updateChamp-data.dto';

@Injectable()
export class ChampsDataService {
    constructor(@InjectRepository(ChampsData) private readonly champsDataRepository : Repository<ChampsData>){

    }
    async getAllDatas():Promise<ChampsData[] | never[]>{
        const data = await this.champsDataRepository.find({
            relations : {
                champs : true
            }
        })
        if(data && data.length >0){
            return data
        }
        return []
    }
    async getData(id : number):Promise<ChampsData> | never{
        const data = await this.champsDataRepository.findOne({
            where : {
                ChampsDataID : id
            },
            relations : {
                champs : true
            }
        })
        if(data){
            return data
        }
        throw new NotFoundException("No se ha enocntrado la data con el id correspondiente")
    }

    async postData(newChampData : InsertChampData):Promise<ChampsData>{
        const campeonData = this.champsDataRepository.create(newChampData)
        return await this.champsDataRepository.save(campeonData)
    }

    async putData(newChampData : InsertChampData,id : number):Promise<ChampsData> | never{
        const data = await this.champsDataRepository.findOne({
            where : {
                ChampsDataID : id
            }
        })
        if(!data){
            throw new NotFoundException("No se ha encontrado la informacion con el id correspondiente")
        }
        data.Region = newChampData.Region;
        data.Rol = newChampData.Rol;
        
        return this.champsDataRepository.save(data)
    }

    async patchData(newChampData : UpdataChampData,id : number):Promise<ChampsData> | never{
        const data = await this.champsDataRepository.findOne({
            where : {
                ChampsDataID : id
            }
        })
        if(!data){
            throw new NotFoundException("No se ha encontrado la informacion con el id correspondiente")
        }
        const dataKeys = Object.keys(data);
        const newChampDataKeys = Object.keys(newChampData);

        for(let i = 0; i < dataKeys.length;i++){
            for(let j = 0; j < newChampDataKeys.length;j++){
                if(dataKeys[i] == newChampDataKeys[j]){
                    data[dataKeys[i]] = newChampData[newChampDataKeys[j]]
                }
            }
        }
        return this.champsDataRepository.save(data)
    }

    async deleteData(id : number):Promise<void> | never{
        const data = await this.champsDataRepository.findOne({
            where : {
                ChampsDataID : id
            }
        })
        if(!data){
            throw new NotFoundException("No se ha encontrado la infomacion con el id correspondiente")
        }
        await this.champsDataRepository.remove(data)
    }
}
