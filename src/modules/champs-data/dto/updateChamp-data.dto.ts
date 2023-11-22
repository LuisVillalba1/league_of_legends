import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Regiones } from "src/common/enums/regiones.enum";
import { Roles } from "src/common/enums/roles.enum";

export class UpdataChampData{
    @IsOptional()
    @IsEnum(Roles)
    @IsNotEmpty({message : "Por favor ingresa un rol para el campeon"})
    Rol? : Roles

    @IsOptional()
    @IsEnum(Regiones)
    @IsNotEmpty({message : "Por favor ingrese una de las regiones"})
    Region? : Regiones
}