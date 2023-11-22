import { IsEnum, IsNotEmpty, IsOptional, IsString,IsNumber} from "class-validator";
import { HabilidadesTeclas } from "src/common/enums/habilidades.enum";

export class UpdateHabilidad{
    @IsOptional()
    @IsString()
    @IsNotEmpty({message : "Por favor ingrese un Nombre de la habilidad"})
    NombreHabilidad? : string

    @IsOptional()
    @IsEnum(HabilidadesTeclas)
    @IsNotEmpty({message : "Por favor ingrese la tecla de la habilidad"})
    Habilidad? : HabilidadesTeclas

    @IsOptional()
    @IsString()
    @IsNotEmpty({message : "Por favor ingrese una descripcion de la habilidad"})
    DescripcionHabilidad? : string

    @IsOptional()
    @IsNumber()
    @IsNotEmpty({message : "Por favor ingrese el id del campeon al cual sera asignado la habilidad"})
    Champ? : number
}