import {Entity,PrimaryGeneratedColumn,Column, OneToMany} from "typeorm"
import { Champs } from "../champs/champs.entity"
import { Regiones } from "../../common/enums/regiones.enum"
import { Roles } from "../../common/enums/roles.enum"

@Entity({name : "champData"})
export class ChampsData{
    @PrimaryGeneratedColumn()
    ChampsDataID : number

    @Column({
        type : "enum",
        enum : Roles
    })
    Rol : Roles

    @Column({
        type : "enum",
        enum : Regiones
    })
    Region : Regiones
    
    @OneToMany(()=>Champs,(champs)=>champs.ChampInfo)
    champs : Champs[]
}