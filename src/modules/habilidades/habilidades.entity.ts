import {Column,PrimaryGeneratedColumn,Entity, ManyToOne} from "typeorm"
import { Champs } from "../champs/champs.entity"
import { HabilidadesTeclas } from "../../common/enums/habilidades.enum"

@Entity({name : "habilidades"})
export class Habilidades{
    @PrimaryGeneratedColumn()
    HabilidadID : number

    @Column("varchar",{
        length : 40
    })
    NombreHabilidad : string

    @Column({
        type : "enum",
        enum : HabilidadesTeclas
    })
    Habilidad : HabilidadesTeclas

    @Column("text")
    DescripcionHabilidad : string

    @ManyToOne(()=>Champs,(champ)=>champ.Habilidades,{onUpdate : "CASCADE",onDelete : "CASCADE"})
    Champ : Champs

}
