import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';

import { ChampsService } from './champs.service';
import { Champs } from './champs.entity';
import { InsertChamp } from './dto/insertChamp.dto';
import { UpdateChamp } from './dto/updateChamp.dto';

@Controller('champs')
export class ChampsController {
    constructor(private readonly champService : ChampsService){

    }
    @Get()
    getChamps() : Promise<Champs[] | never[]>{
        return this.champService.getAllchamps()
    }

    @Get(":id")
    getChamp(@Param("id") id : number):Promise<Champs> | never{
        return this.champService.getChamp(id)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    createChamp(@Body() newChamp : InsertChamp):Promise<Champs> | never{
        return this.champService.postChamps(newChamp)
    }

    @Put(":id")
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    updateChamp(@Body() dataChamp : InsertChamp,@Param("id") id : number):Promise<Champs> | never{
        return this.champService.putChamp(dataChamp,id)
    }

    @Patch(":id")
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    updatePatchChamp(@Body() dataChamp : UpdateChamp,@Param("id") id : number){
        return this.champService.patchChamp(dataChamp,id)
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    removeChamp(@Param("id") id : number){
        return this.champService.deleteChamps(id)
    }

}
