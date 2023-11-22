import { Controller,Get,Param,Post,UsePipes,ValidationPipe,Body,Put,Delete,Patch,HttpCode,HttpStatus} from '@nestjs/common';
import { ChampsDataService } from './champs-data.service';
import { ChampsData } from './champsData.entity';
import { InsertChampData } from './dto/insertChamp-data.dto';
import { UpdataChampData } from './dto/updateChamp-data.dto';

@Controller('champs-data')
export class ChampsDataController {
    constructor(private readonly champsDataService : ChampsDataService){

    }
    @Get()
    mostrarDatas():Promise<ChampsData[] | never[]>{
        return this.champsDataService.getAllDatas()
    }

    @Get(":id")
    mostrarData(@Param("id") id : number):Promise<ChampsData> | never{
        return this.champsDataService.getData(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    crearCampeonData(@Body() champData : InsertChampData):Promise<ChampsData>{
        return this.champsDataService.postData(champData)
    }

    @Put(":id")
    @UsePipes(ValidationPipe)
    modificarCampeonData(@Body() champData : InsertChampData,@Param("id") id : number):Promise<ChampsData> | never{
        return this.champsDataService.putData(champData,id)
    }

    @Patch(":id")
    @UsePipes(ValidationPipe)
    modificarCampeonDataPatch(@Body() champData : UpdataChampData,@Param("id") id : number):Promise<ChampsData> | never{
        return this.champsDataService.patchData(champData,id)
    }


    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteCampeonData(@Param("id") id : number):Promise<void> | never{
        return this.champsDataService.deleteData(id)
    }

}
