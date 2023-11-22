import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { HabilidadesTeclas } from "src/common/enums/habilidades.enum";

export class InsertHabilidad{
    @IsString()
    @IsNotEmpty({message : "Por favor ingrese un el nombre de la habilidad"})
    NombreHabilidad : string

    @IsEnum(HabilidadesTeclas)
    @IsNotEmpty({message : "Por favor ingrese la tecla de la habilidad"})
    Habilidad : HabilidadesTeclas

    @IsString()
    @IsNotEmpty({message : "Por favor ingrese una descripcion de la habilidad"})
    DescripcionHabilidad : string

    @IsNumber()
    @IsNotEmpty({message : "Por favor ingrese el id del campeon al cual sera asignado la habilidad"})
    Champ : number
}