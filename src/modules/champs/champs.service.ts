import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm"
import { Injectable, NotFoundException } from '@nestjs/common';

import { InsertChamp } from './dto/insertChamp.dto';
import { UpdateChamp } from './dto/updateChamp.dto';
import { ChampsData } from '../champs-data/champsData.entity';
import { Champs } from './champs.entity';

@Injectable()
export class ChampsService {
    constructor(@InjectRepository(Champs) private readonly champsRepository : Repository<Champs>,
                @InjectRepository(ChampsData) private readonly champsDataRepository : Repository <ChampsData>){
    }
    async getAllchamps() : Promise<Champs[] | never[]>{
        const champs = await this.champsRepository.find({
            relations :{
                ChampInfo : true,
                Habilidades : true
            }
        });

        if(champs && champs.length > 0){
            return champs
        }
        return []
    }

    async getChamp(id : number):Promise<Champs> | never{
        const champ = await this.champsRepository.findOne({
            where :{
                ChampID : id
            },
            relations : {
                ChampInfo : true,
                Habilidades : true
            }
        })
        if(champ){
            return champ
        }
        throw new NotFoundException("No se ha encontrado el campeon correspondiente")
    }

    async postChamps({Nombre,ChampInfoID} : InsertChamp) : Promise<Champs>{
        const champData = await this.champsDataRepository.findOne({
            where : {
                ChampsDataID : ChampInfoID
            }
        })
        if(!champData){
            throw new NotFoundException("Lo siento no se ha encontrado el ID de la data correspondiente")
        }
        const newChamp = new Champs()
        newChamp.Nombre = Nombre,
        newChamp.ChampInfo = champData
        return this.champsRepository.save(newChamp)
    }

    async putChamp({Nombre , ChampInfoID} : InsertChamp,id : number):Promise<Champs> | never{
        const champData = await this.champsDataRepository.findOne({
            where : {
                ChampsDataID : ChampInfoID
            }
        })
        if(!champData){
            throw new NotFoundException("Lo siento no se ha encontrado el ID de la data correspondiente")
        }
        const champ = await this.champsRepository.findOne({
            where : {
                ChampID : id
            }
        })
        if(champ){
            champ.Nombre = Nombre;
            champ.ChampInfo = champData;
            return this.champsRepository.save(champ)
        }
        throw new NotFoundException("No se ha encontrado el campeon correspondiente")
    }

    async patchChamp(newData : UpdateChamp,id : number){
        const champ = await this.champsRepository.findOne({
            where : {
                ChampID : id
            }
        })
        if(!champ){
            throw new NotFoundException("No se ha encontrado el campeon correspondiente")
        }
        if (newData.ChampInfoID) {
            const champData = await this.champsDataRepository.findOne({
                where : {
                    ChampsDataID: newData.ChampInfoID
                }
            });
            if(!champData){
                throw new NotFoundException("Lo siento no se ha encontrado el ID de la data correspondiente")
            }
            champ.ChampInfo = champData;
        }
        const champKeys = Object.keys(champ);
        const newDataKeys = Object.keys(newData);

        for(let i = 0; i < champKeys.length;i++){
            for(let j = 0; j < newDataKeys.length;j++){
                if(champKeys[j] == newDataKeys[i]){
                    champ[champKeys[i]] = newData[newDataKeys[j]]
                }
            }
        }
        const saveData = await this.champsRepository.save(champ)
        return await this.champsRepository.findOne({
            where : {
                ChampID : saveData.ChampID
            },
            relations : {
                ChampInfo : true
            }
        })
    }

    async deleteChamps(id : number):Promise<void> | never{
        const champ = await this.champsRepository.findOne({
            where : {
                ChampID : id
            }
        })
        if(champ){
            this.champsRepository.remove(champ);
            return 
        }
        throw new NotFoundException("No se ha encontrado el campeon solicitado")
    }
}
