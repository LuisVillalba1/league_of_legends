import { Controller,Get,Param,Post,UsePipes,ValidationPipe,Body,Delete,Put, Patch,HttpCode,HttpStatus} from '@nestjs/common';

import { HabilidadesService } from './habilidades.service';
import { InsertHabilidad } from './dto/insertHabilidad.dto';
import { Habilidades } from './habilidades.entity';
import { UpdateHabilidad } from './dto/updateHabilidad.dto';

@Controller('habilidades')
export class HabilidadesController {
    constructor(private readonly habilidadesService : HabilidadesService){

    }
    @Get()
    mostrarTodasHabilidades():Promise<Habilidades[] | string>{
        return this.habilidadesService.getAllHabilidades()
    }

    @Get(":id")
    mostrarHabilidad(@Param("id") id : number):Promise<Habilidades> | never{
        return this.habilidadesService.getHabilidad(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    CrearHabilidad(@Body() newHabilidad : InsertHabilidad):Promise<Habilidades>{
        return this.habilidadesService.postHabilidad(newHabilidad)
    }

    @Put(":id")
    @UsePipes(ValidationPipe)
    updateHabilidad(@Body() newHabilidadData : InsertHabilidad,@Param("id") id : number):Promise<Habilidades> | never{
        return this.habilidadesService.putHabilidad(newHabilidadData,id)
    }

    @Patch(":id")
    @UsePipes(ValidationPipe)
    updateHabilidadPatch(@Body() newHabilidadData : UpdateHabilidad,@Param("id") id : number):Promise<Habilidades> | never{
        return this.habilidadesService.patchHabilidad(newHabilidadData,id)
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    eliminarHabilidad(@Param("id") id : number):Promise<Habilidades | void>{
        return this.habilidadesService.deleteHabilidad(id)
    }

}

