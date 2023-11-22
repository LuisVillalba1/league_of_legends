import { Test, TestingModule } from '@nestjs/testing';
import { ChampsDataService } from './champs-data.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChampsData } from './champsData.entity';
import { Roles } from '../../common/enums/roles.enum';
import { Regiones } from '../../common/enums/regiones.enum';
import { NotFoundException } from '@nestjs/common';

describe('ChampsDataService', () => {
  let service: ChampsDataService;

  const champsDataRepositoryMokc = {
    find: jest.fn(),
    save : jest.fn().mockResolvedValue(ChampsData),
    create : jest.fn(),
    findOne: jest.fn().mockResolvedValue(ChampsData),
    remove : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChampsDataService,{
        provide : getRepositoryToken(ChampsData),
        useValue : champsDataRepositoryMokc
      },
    ],
    }).compile();

    service = module.get<ChampsDataService>(ChampsDataService);
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  describe("getAllDatas",()=>{
    it("obtenemos todos los champs data",async()=>{

      const mockChampData = [{
        ChampsDataID : 1,
        Rol : Roles.Apoyo,
        Region : Regiones.Demacia,
        champs : []
      }]

      const findSpyOn = jest.spyOn(champsDataRepositoryMokc,"find").mockResolvedValue(mockChampData);

      const data = await service.getAllDatas();


      expect(champsDataRepositoryMokc.find).toHaveBeenCalled();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      
      findSpyOn.mockRestore();
    })
    it("no hay champs data definidos",async()=>{

      const findSpyOn = jest.spyOn(champsDataRepositoryMokc,"find").mockResolvedValue([])
      const champ = await service.getAllDatas();
      
      expect(champsDataRepositoryMokc.find).toHaveBeenCalled();
      expect(champ).toBeInstanceOf(Array);
      expect(champ.length).toBe(0);

      findSpyOn.mockRestore();
    })
  })
  describe("getChampData",()=>{
    it("obtenemos un champ data",async()=>{
      const id = 1;
      const mockChampData = {
        ChampsDataID : id,
        Rol : Roles.Apoyo,
        Region : Regiones.Demacia,
        champs : []
      }
      champsDataRepositoryMokc.findOne.mockResolvedValue(mockChampData)

      const champData = await service.getData(id);

      expect(champsDataRepositoryMokc.findOne).toHaveBeenCalled();
      expect(champData).toBeInstanceOf(Object);
      expect(champData).toEqual(mockChampData);

    });
    it("champ data no encontrada",async()=>{
      const id = 1;

      champsDataRepositoryMokc.findOne.mockResolvedValue(null);

      await expect(service.getData(id)).rejects.toThrow(NotFoundException)
    })
  });
  describe("postChampData",()=>{
    it("creamos un champ data",async()=>{
      const mockChampDataInsert = {
        Rol : Roles.Asesino,
        Region : Regiones.ElVacio
      }

      const mockChampDataSave = {
        ChampsDataID : 1,
        Rol : Roles.Apoyo,
        Region : Regiones.Demacia,
        champs : []
      }

      champsDataRepositoryMokc.create.mockResolvedValue(mockChampDataInsert)
      champsDataRepositoryMokc.save.mockResolvedValue(mockChampDataSave)

      const champData = await service.postData(mockChampDataInsert);

      expect(champsDataRepositoryMokc.create).toHaveBeenCalledWith(mockChampDataInsert);
      expect(champsDataRepositoryMokc.save).toHaveBeenCalled();
      expect(champData).toEqual(mockChampDataSave)
    })
  });
  describe("putChampData",()=>{
    it("modificamos un champ data",async()=>{
      const id = 1;
      const mockChampDataInsert = {
        Rol : Roles.Tanque,
        Region : Regiones.ElVacio
      }

      const mockChampData = {
        ChampsDataID : id,
        Rol : Roles.Asesino,
        Region : Regiones.Demacia,
        champs : []
      }

      champsDataRepositoryMokc.findOne.mockResolvedValue(mockChampData);

      mockChampData.Region = mockChampDataInsert.Region;
      mockChampData.Rol = mockChampDataInsert.Rol;

      champsDataRepositoryMokc.save.mockResolvedValue(mockChampData);

      const champData = await service.putData(mockChampDataInsert,id);

      expect(champsDataRepositoryMokc.findOne).toHaveBeenCalled();
      expect(champsDataRepositoryMokc.save).toHaveBeenCalledWith(mockChampData)
      expect(champData).toBeInstanceOf(Object);
      expect(champData.Region).toBe(mockChampData.Region);
      expect(champData).toEqual(mockChampData)
    });
    it("champ data no encontrada",async()=>{
      const id = 1;
      const mockChampDataInsert = {
        Rol : Roles.Tanque,
        Region : Regiones.ElVacio
      }
      champsDataRepositoryMokc.findOne.mockResolvedValue(null);

      await expect(service.putData(mockChampDataInsert,id)).rejects.toThrow(NotFoundException)
    });
  })
  describe("patchChampData",()=>{
    it("modificamos los valores de un champ data",async()=>{
      const id = 1;
      const mockChampDataInsert = {
        Rol : Roles.Tanque
      }

      const mockChampData = {
        ChampsDataID : id,
        Rol : Roles.Asesino,
        Region : Regiones.Demacia,
        champs : []
      }

      champsDataRepositoryMokc.findOne.mockResolvedValue(mockChampData);

      const mockChampDataKeys = Object.keys(mockChampData);
      const mockChampDataInsertKeys = Object.keys(mockChampDataInsert);

      for(let i = 0;i < mockChampDataKeys.length;i++){
        for(let j = 0; j < mockChampDataInsertKeys.length;j++){
          if(mockChampDataKeys[i] == mockChampDataInsertKeys[j]){
            mockChampData[mockChampDataKeys[i]] = mockChampDataInsert[mockChampDataInsertKeys[j]];
          }
        }
      }

      champsDataRepositoryMokc.save(mockChampData);

      const champData = await service.patchData(mockChampDataInsert,id);

      expect(champsDataRepositoryMokc.findOne).toHaveBeenCalled();
      expect(champsDataRepositoryMokc.save).toHaveBeenCalledWith(mockChampData);
      expect(champData).toBeInstanceOf(Object);
      expect(champData.Rol).toBe(mockChampData.Rol)
    });
    it("champ data no encontrada",async()=>{
      const id = 1;
      const mockChampDataInsert = {
        Rol : Roles.Tanque
      }
      champsDataRepositoryMokc.findOne.mockResolvedValue(null);

      await expect(service.patchData(mockChampDataInsert,id)).rejects.toThrow(NotFoundException)
    })
  })
  describe("deleteChampData",()=>{
    it("eliminamos un champ data",async()=>{
      const id = 1;

      const mockChampData = {
        ChampsDataID : id,
        Rol : Roles.Asesino,
        Region : Regiones.Demacia,
        champs : []
      }
      champsDataRepositoryMokc.findOne.mockResolvedValue(mockChampData);

      champsDataRepositoryMokc.remove.mockResolvedValue(mockChampData);

      await service.deleteData(id);

      expect(champsDataRepositoryMokc.findOne).toHaveBeenCalled();
      expect(champsDataRepositoryMokc.remove).toHaveBeenCalledWith(mockChampData);
    });
    it("champ data no encontrada",async()=>{
      const id = 1;

      champsDataRepositoryMokc.findOne.mockResolvedValue(null);

      await expect(service.deleteData(id)).rejects.toThrow(NotFoundException)
    })
  })
});
