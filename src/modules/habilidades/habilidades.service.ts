import { Injectable,NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm"
import { Habilidades } from './habilidades.entity';
import {Repository} from "typeorm"
import { InsertHabilidad } from './dto/insertHabilidad.dto';
import { Champs } from '../champs/champs.entity';
import { UpdateHabilidad } from './dto/updateHabilidad.dto';

@Injectable()
export class HabilidadesService {
    constructor(@InjectRepository(Habilidades) private readonly habilidadesRepository : Repository<Habilidades>,
                @InjectRepository(Champs) private readonly champsRepository : Repository<Champs>)
                {}

    async getAllHabilidades():Promise<Habilidades[] | string>{
        const habilidades = await this.habilidadesRepository.find({
            relations : {
                Champ : true
            }
        })
        if(habilidades && habilidades.length <= 0){
            return "No hay ninguna habilidad cargada por el momento"
        }
        return habilidades
    }

    async getHabilidad(id : number):Promise<Habilidades> | never{
        const habilidad = await this.habilidadesRepository.findOne({
            where : {
                HabilidadID : id
            },
            relations : {
                Champ : true
            }
        })
        if(habilidad){
            return habilidad
        }
        throw new NotFoundException("No se ha encontrado la habilidad con el id correspondiente")
    }

    async postHabilidad(newHabilidad : InsertHabilidad):Promise<Habilidades>{
        const champData = await this.champsRepository.findOne({
            where : {
                ChampID : newHabilidad.Champ
            }
        })
        if(!champData){
            throw new NotFoundException("No se ha encontrado el champ correspondiente")
        }
        const habilidad =  this.habilidadesRepository.create({
            NombreHabilidad : newHabilidad.NombreHabilidad,
            Habilidad : newHabilidad.Habilidad,
            Champ : champData,
            DescripcionHabilidad : newHabilidad.DescripcionHabilidad
        })
        return this.habilidadesRepository.save(habilidad)
    }

    async putHabilidad(newHabilidadData : InsertHabilidad,id : number):Promise<Habilidades> | never{
        const habilidad = await this.habilidadesRepository.findOne({
            where : {
                HabilidadID : id
            }
        })
        const champ = await this.champsRepository.findOne({
            where : {
                ChampID : newHabilidadData.Champ
            }
        })
        if(!habilidad || !champ){
            throw new NotFoundException("No se ha encontrado la habilidad y/o champ con el id correspondiente")
        }
        habilidad.DescripcionHabilidad = newHabilidadData.DescripcionHabilidad;
        habilidad.Habilidad = newHabilidadData.Habilidad;
        habilidad.NombreHabilidad = newHabilidadData.NombreHabilidad;
        habilidad.Champ = champ

        return this.habilidadesRepository.save(habilidad)
    }

    async patchHabilidad(newHabilidadData : UpdateHabilidad,id : number):Promise<Habilidades> | never{
        const habilidad = await this.habilidadesRepository.findOne({
            where :{
                HabilidadID : id
            }
        })
        
        if(!habilidad){
            throw new NotFoundException("No se ha encontrado la habilidad con el id correspondiente")
        }

        if(newHabilidadData.Champ){
            const champ = await this.champsRepository.findOne({
                where :{
                    ChampID : newHabilidadData.Champ
                }
            })
            if(!champ){
                throw new NotFoundException("No se ha encontrado el champ en especifico")
            }
            habilidad.Champ = champ;
        }
        const habilidadKeys = Object.keys(habilidad);
        const newHabilidadDataKeys = Object.keys(newHabilidadData);

        for(let i = 0; i < habilidadKeys.length;i++){
            for(let j = 0; j < newHabilidadDataKeys.length;j++){
                if(newHabilidadDataKeys[j] == habilidadKeys[i] && habilidadKeys[i] != "Champ"){
                    habilidad[habilidadKeys[i]] = newHabilidadData[newHabilidadDataKeys[j]]
                }
            }
        }
        const dataNueva = await this.habilidadesRepository.save(habilidad)
        return this.habilidadesRepository.findOne({
            where : {
                HabilidadID : dataNueva.HabilidadID
            },
            relations : {
                Champ : true
            }
        })
    }

    async deleteHabilidad(id : number):Promise<Habilidades | void>{
        const habilidad = await this.habilidadesRepository.findOne({
            where : {
                HabilidadID : id
            }
        })
        if(!habilidad){
            throw new NotFoundException("No se ha encontrado la habilidad con el id correspondiente")
        }
        await this.habilidadesRepository.remove(habilidad)
    }
}
