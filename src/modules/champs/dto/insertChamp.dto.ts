import { IsString,IsNotEmpty,IsNumber } from "class-validator";

export class InsertChamp{
    @IsString()
    @IsNotEmpty({message : "Por favor ingrese el Nombre del champ"})
    readonly Nombre : string;

    @IsNumber()
    @IsNotEmpty({message : "Por favor ingrese un ChampInfoID"})
    readonly ChampInfoID : number
}