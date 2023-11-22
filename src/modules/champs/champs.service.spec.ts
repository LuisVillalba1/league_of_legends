import { Test, TestingModule } from '@nestjs/testing';
import { ChampsService } from './champs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Champs } from './champs.entity';
import { ChampsData } from '../champs-data/champsData.entity';
import { Roles } from '../../common/enums/roles.enum';
import { Regiones } from '../../common/enums/regiones.enum';
import {NotFoundException } from '@nestjs/common';
import { HabilidadesTeclas } from '../../common/enums/habilidades.enum';

describe('ChampsService', () => {
  let service: ChampsService;

  const champRepositoryMock = {
    find : jest.fn(),
    save : jest.fn().mockResolvedValue(Champs),
    findOne : jest.fn().mockResolvedValue(Champs),
    remove : jest.fn()
  }
  const champDataRepositoryMock = {
    create : jest.fn(),
    findOne : jest.fn().mockResolvedValue(ChampsData)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChampsService,
        {
        provide : getRepositoryToken(Champs),
        useValue : champRepositoryMock
      },
      {
        provide: getRepositoryToken(ChampsData),
        useValue: champDataRepositoryMock
      }
    ],
    }).compile();

    service = module.get<ChampsService>(ChampsService);
  });

  describe("getAllChamps",()=>{
    it("obtenemos los champs",async ()=>{
      const mockChamp = [{
        ChampID : 1,
        Nombre : "Nombre del champ",
        ChampInfo : {
          ChampsDataID : 1,
          Rol : Roles.Asesino,
          Region : Regiones.Aguasturbias
        },
        Habilidades : [
          {
            HabilidadID : 1,
            NombreHabilidad : "Nombre habilidad",
            Habilidad : HabilidadesTeclas.Pasiva,
            DescripcionHabilidad : "Descripcion"
          }
        ]
      }]

      jest.spyOn(champRepositoryMock,"find").mockResolvedValue(mockChamp);

      const champs = await service.getAllchamps();
      expect(champRepositoryMock.find).toHaveBeenCalled()
      expect(champs).toBeInstanceOf(Array);
      expect(champs.length).toBeGreaterThan(0)
    });
    it("no champs",async()=>{
      jest.spyOn(champRepositoryMock,"find").mockResolvedValue([]);

      const champs = await service.getAllchamps();

      expect(champRepositoryMock.find).toHaveBeenCalled();
      expect(champs).toBeInstanceOf(Array);
      expect(champs.length).toBe(0);
    })
  })
  describe("getChamp",()=>{
    it("obtenmos un champ",async()=>{
      const champID = 1;

      const mockChamp = {
        ChampID : champID,
        Nombre : "Nombre del champ",
        ChampInfo : {
          ChampsDataID : 1,
          Rol : Roles.Asesino,
          Region : Regiones.Aguasturbias
        },
        Habilidades : [
          {
            HabilidadID : 1,
            NombreHabilidad : "Nombre habilidad",
            Habilidad : HabilidadesTeclas.Pasiva,
            DescripcionHabilidad : "Descripcion"
          }
        ]
      }
      //simulamos que el la funcion getChamp de nuestro service se comporte como nuestro mockChamp
      champRepositoryMock.findOne.mockResolvedValueOnce(mockChamp);

      const champ = await service.getChamp(champID);

      expect(champRepositoryMock.findOne).toHaveBeenCalled();
      expect(champ).toBeInstanceOf(Object)
      expect(champ).toEqual(mockChamp)
    })
    it("champ no encontrado",async ()=>{
      const champID = -1;

      champRepositoryMock.findOne.mockResolvedValue(null);

      expect(champRepositoryMock.findOne).toHaveBeenCalled();
      await expect(service.getChamp(champID)).rejects.toThrow(NotFoundException);
    })
  });

  describe("postChamp",()=>{
    it("creamos un nuevo champ",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : 1
      }

      const mockChampData = {
        ChampsDataID : mockInsert.ChampInfoID,
        Rol : Roles.Asesino,
        Region : Regiones.Jonia,
        champs : null
      }
      champDataRepositoryMock.findOne.mockResolvedValueOnce(({
        ChampsDataID : mockInsert.ChampInfoID
      }));

      const newChamp = new Champs();
      newChamp.Nombre = mockInsert.Nombre;
      newChamp.ChampInfo = mockChampData;

      champRepositoryMock.save.mockResolvedValue(newChamp);

      const createdChamp = await service.postChamps(mockInsert);

      expect(createdChamp).toBeInstanceOf(Champs);
      expect(createdChamp.Nombre).toBe(mockInsert.Nombre);
      expect(createdChamp.ChampInfo).toEqual(mockChampData);
    });
    it("champ data no encontrada",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : 1
      }
      champDataRepositoryMock.findOne.mockResolvedValue(null);

      expect(champDataRepositoryMock.findOne).toHaveBeenCalled();
      await expect(service.postChamps(mockInsert)).rejects.toThrow(NotFoundException);
    })
  })

  describe("putChamp",()=>{
    it("modificamos todos los valores de un champ",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : 1
      }
      const idInsert = 1;

      const mockChampData = {
        ChampsDataID : mockInsert.ChampInfoID,
        Rol : Roles.Asesino,
        Region : Regiones.Jonia,
        champs : null
      }
      champDataRepositoryMock.findOne.mockResolvedValueOnce(({
        ChampsDataID : mockInsert.ChampInfoID
      }));

      champRepositoryMock.findOne.mockResolvedValueOnce(({
        ChampID : idInsert
      }));

      const champData = await service.putChamp(mockInsert,idInsert)

      champData.ChampInfo = mockChampData;
      champData.Nombre = mockInsert.Nombre

      champRepositoryMock.save.mockResolvedValue(champData);

      expect(champData).toBeDefined();
      expect(champData.Nombre).toBe(mockInsert.Nombre);
      expect(champData.ChampInfo).toEqual(mockChampData);
    });
    it("champ no encontrado",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : 1
      }
      const idInsert = 1;

      champRepositoryMock.findOne.mockResolvedValue(null);

      expect(champDataRepositoryMock.findOne).toHaveBeenCalled();
      await expect(service.putChamp(mockInsert,idInsert)).rejects.toThrow(NotFoundException);
    });
    it("champ data no encontrado",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : 1
      };

      const idInsert = 1;

      const mockChamp = {
        ChampID : idInsert,
        Nombre : "Nombre del champ",
        ChampInfo : {
          ChampsDataID : 1,
          Rol : Roles.Asesino,
          Region : Regiones.Aguasturbias
        },
        Habilidades : []
      }

      champRepositoryMock.findOne.mockResolvedValue(mockChamp);

      champDataRepositoryMock.findOne.mockResolvedValue(null);

      expect(champRepositoryMock.findOne).toHaveBeenCalled();
      expect(champDataRepositoryMock.findOne).toHaveBeenCalled();
      await expect(service.putChamp(mockInsert,idInsert)).rejects.toThrow(NotFoundException);
    })
  })
  describe("patchChamp",()=>{
    it("modificamos un valor de un champ",async()=>{
      const mockUpdate = {
        ChampInfoID : 1
      }
      const mockChampData = {
        ChampsDataID : mockUpdate.ChampInfoID,
        Rol : Roles.Asesino,
        Region : Regiones.Jonia,
        champs : null
      }
      const idInsert = 1;

      champDataRepositoryMock.findOne.mockResolvedValueOnce({
        ChampsDataID : mockUpdate.ChampInfoID
      });
      champRepositoryMock.findOne.mockResolvedValue({
        ChampID : idInsert
      });

      const newDataChamp = await service.patchChamp(mockUpdate,idInsert);

      newDataChamp.ChampInfo = mockChampData;

      champRepositoryMock.save.mockResolvedValue(newDataChamp);

      expect(newDataChamp).toBeDefined();
      expect(newDataChamp.ChampInfo).toEqual(mockChampData)
    });
    it("champ data no encontrada",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : -1
      };

      const idInsert = 1;

      const mockChamp = {
        ChampID : idInsert,
        Nombre : "Nombre del champ",
        ChampInfo : {
          ChampsDataID : 1,
          Rol : Roles.Asesino,
          Region : Regiones.Aguasturbias
        },
        Habilidades : []
      }

      champRepositoryMock.findOne.mockResolvedValue(mockChamp);

      champDataRepositoryMock.findOne.mockResolvedValue(null);

      expect(champDataRepositoryMock.findOne).toHaveBeenCalled();
      expect(champDataRepositoryMock.findOne).toHaveBeenCalled();
      await expect(service.patchChamp(mockInsert,idInsert)).rejects.toThrow(NotFoundException);

    });
    it("Error NotFoundException,incorrect id champ",async()=>{
      const mockInsert = {
        Nombre : "Nombre",
        ChampInfoID : 1
      };
      const idInsert = 1;

      champRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.patchChamp(mockInsert,idInsert)).rejects.toThrow(NotFoundException);
    })
  })
  describe("deleteChamp",()=>{
    it("eliminamos un champ",async()=>{
      const idInsert = 1;

      champRepositoryMock.findOne.mockResolvedValueOnce({
        ChampID : idInsert
      })

      await service.deleteChamps(idInsert);


      expect(champRepositoryMock.remove).toHaveBeenCalled()
    });
    it("champ no encontrado",async()=>{
      const idInsert = 1;

      champRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.deleteChamps(idInsert)).rejects.toThrow(NotFoundException);
    })
  })
});
