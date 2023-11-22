import { IsString,IsNotEmpty,IsNumber, IsOptional } from "class-validator";

export class UpdateChamp{
    @IsOptional()
    @IsString()
    @IsNotEmpty({message : "Por favor ingrese el Nombre del champ"})
    readonly Nombre? : string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty({message : "Por favor ingrese un InfoChampID"})
    readonly ChampInfoID? : number
}