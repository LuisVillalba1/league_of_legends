import {Entity,PrimaryGeneratedColumn,Column, OneToMany, ManyToOne} from "typeorm"

import { ChampsData } from "../champs-data/champsData.entity"
import { Habilidades } from "../habilidades/habilidades.entity"

@Entity({name : "champs"})
export class Champs {
    @PrimaryGeneratedColumn()
    ChampID : number

    @Column("varchar",{
        length : 50
    })
    Nombre : string

    @ManyToOne(()=>ChampsData,(champData)=>champData.champs,{onUpdate : "CASCADE",onDelete : "CASCADE"})
    ChampInfo : ChampsData

    @OneToMany(()=>Habilidades,(habilidad)=>habilidad.Champ,{onUpdate : "CASCADE",onDelete : "CASCADE"})
    Habilidades : Habilidades[]
}