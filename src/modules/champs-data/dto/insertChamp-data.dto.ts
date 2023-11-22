import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Regiones } from "src/common/enums/regiones.enum";
import { Roles } from "src/common/enums/roles.enum";

export class InsertChampData{
    @IsEnum(Roles)
    @IsNotEmpty({message : "Por favor ingrese el rol del campeon"})
    Rol : Roles

    @IsEnum(Regiones)
    @IsNotEmpty({message : "Por favor ingrese una region"})
    Region : Regiones

}