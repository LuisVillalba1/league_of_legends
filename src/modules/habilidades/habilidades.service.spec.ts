import { Test, TestingModule } from '@nestjs/testing';
import { HabilidadesService } from './habilidades.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Habilidades } from './habilidades.entity';
import { Champs } from '../champs/champs.entity';
import {NotFoundException } from '@nestjs/common';
import { HabilidadesTeclas } from '../../common/enums/habilidades.enum';

describe('HabilidadesService', () => {
  let service: HabilidadesService;

  const habilidadesRespositoryMock = {
    find : jest.fn(),
    findOne : jest.fn(),
    create : jest.fn(),
    save : jest.fn(),
    remove : jest.fn()
  }

  const champsRepositoryMock = {
    findOne : jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabilidadesService,
        {
        provide : getRepositoryToken(Habilidades),
        useValue : habilidadesRespositoryMock
      },
      {
        provide : getRepositoryToken(Champs),
        useValue : champsRepositoryMock
      }
    ],
    }).compile();

    service = module.get<HabilidadesService>(HabilidadesService);
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });
  describe("getHabilidades",()=>{
    it("obtenemos todas las habilidades",async()=>{
      const habilidadesMock = [{
        HabilidadID : 1,
        NombreHabilidad : "jorgue",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : null
      }]

      habilidadesRespositoryMock.find.mockResolvedValue(habilidadesMock);

      const habilidades = await service.getAllHabilidades();

      expect(habilidadesRespositoryMock.find).toHaveBeenCalled();
      expect(habilidades).toBeInstanceOf(Array)
      expect(habilidades).toEqual(habilidadesMock)
    })
  })
  describe("getHabilidad",()=>{
    it("obtenemos una habilidad",async()=>{
      const id = 1
      const habilidadMock = {
        HabilidadID : id,
        NombreHabilidad : "jorgue",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : null
      }
      habilidadesRespositoryMock.findOne.mockResolvedValue(habilidadMock);

      const habilidad = await service.getHabilidad(id);

      expect(habilidadesRespositoryMock.findOne).toHaveBeenCalled();
      expect(habilidad).toBeInstanceOf(Object);
      expect(habilidad).toEqual(habilidadMock);

    })
    it("habilidad no encontrada",async()=>{
      const id = -1
      try{
        await service.getHabilidad(id)
      }
      catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe("No se ha encontrado la habilidad con el id correspondiente")
      }
    })
  });
  describe("postHabilida",()=>{
    it("creamos una habilidad",async()=>{
      const mockHabilidadInsert = {
        NombreHabilidad : "noc",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : 1
      }

      const mockChamp = {
        ChampID : mockHabilidadInsert.Champ,
        Nombre : "Zed",
        ChampInfo : {},
        Habilidades : []
      }

      const mockHabilidad = {
        NombreHabilidad : mockHabilidadInsert.NombreHabilidad,
        Habilidad : mockHabilidadInsert.Habilidad,
        DescripcionHabilidad : mockHabilidadInsert.DescripcionHabilidad,
        Champ : mockChamp
      }

      champsRepositoryMock.findOne.mockResolvedValue(mockChamp);

      habilidadesRespositoryMock.create.mockResolvedValue(mockHabilidad);

      habilidadesRespositoryMock.save.mockResolvedValue(mockHabilidad);

      const newHabilidad = await service.postHabilidad(mockHabilidadInsert);

      expect(champsRepositoryMock.findOne).toHaveBeenCalled();
      expect(habilidadesRespositoryMock.create).toHaveBeenCalledWith(mockHabilidad);
      expect(habilidadesRespositoryMock.save).toHaveBeenCalled();
      expect(newHabilidad).toBeDefined();
      expect(newHabilidad).toBeInstanceOf(Object);
      expect(newHabilidad).toEqual(mockHabilidad);
    });
    it("champ no encontrado",async()=>{
      const mockHabilidadInsert = {
        NombreHabilidad : "noc",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : 1
      }

      champsRepositoryMock.findOne.mockResolvedValue(null);

      await(expect(service.postHabilidad(mockHabilidadInsert))).rejects.toThrow(NotFoundException)
    })
  })
  describe("putHabilidad",()=>{
    it("modificamos la inforamcion de una habilidad",async()=>{
      const id = 1;
      const mockHabilidadInsert = {
        NombreHabilidad : "jorgue",
        Habilidad : HabilidadesTeclas.E,
        DescripcionHabilidad : "hace algo chido",
        Champ : 1
      }
      const mockChamp = {
        ChampID : mockHabilidadInsert.Champ,
        Nombre : "Zed",
        ChampInfo : {},
        Habilidades : []
      }

      const mockHabilidad = {
        HabilidadID : id,
        NombreHabilidad : "noc",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : mockChamp
      }

      habilidadesRespositoryMock.findOne.mockResolvedValue(mockHabilidad);

      champsRepositoryMock.findOne.mockResolvedValue(mockChamp);

      mockHabilidad.NombreHabilidad = mockHabilidadInsert.NombreHabilidad;
      mockHabilidad.Habilidad = mockHabilidadInsert.Habilidad;
      mockHabilidad.DescripcionHabilidad = mockHabilidadInsert.DescripcionHabilidad;
      mockHabilidad.Champ = mockChamp;

      habilidadesRespositoryMock.save.mockResolvedValue(mockHabilidad);

      const habilidadModify = await service.putHabilidad(mockHabilidadInsert,id);

      expect(habilidadesRespositoryMock.findOne).toHaveBeenCalled();
      expect(champsRepositoryMock.findOne).toHaveBeenCalled();
      expect(habilidadModify).toEqual(mockHabilidad);
      expect(habilidadModify.NombreHabilidad).toEqual(mockHabilidadInsert.NombreHabilidad);
    });
    it("habilidad no encontrada",async()=>{
      const id = 1;
      const mockHabilidadInsert = {
        NombreHabilidad : "jorgue",
        Habilidad : HabilidadesTeclas.E,
        DescripcionHabilidad : "hace algo chido",
        Champ : 1
      }

      habilidadesRespositoryMock.findOne.mockResolvedValue(null);

      expect(habilidadesRespositoryMock.findOne).toHaveBeenCalled()
      await expect(service.putHabilidad(mockHabilidadInsert,id)).rejects.toThrow(NotFoundException)
    })
    it("champ no encontrado",async()=>{
      const id = 1;
      const mockHabilidadInsert = {
        NombreHabilidad : "jorgue",
        Habilidad : HabilidadesTeclas.E,
        DescripcionHabilidad : "hace algo chido",
        Champ : 1
      }
      const mockChamp = {
        ChampID : 1,
        Nombre : "Zed",
        ChampInfo : {},
        Habilidades : []
      }

      const mockHabilidad = {
        HabilidadID : id,
        NombreHabilidad : "noc",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : mockChamp
      }

      habilidadesRespositoryMock.findOne.mockResolvedValue(mockHabilidad);

    
      champsRepositoryMock.findOne.mockResolvedValue(null);

      expect(habilidadesRespositoryMock.findOne).toHaveBeenCalled();
      expect(champsRepositoryMock.findOne).toHaveBeenCalled();
      await expect(service.putHabilidad(mockHabilidadInsert,id)).rejects.toThrow(NotFoundException)
    })
  })
  describe("patchHabilidad",()=>{
    it("modificamos la informacion de una habilidad",async()=>{
      const id = 1;
      const mockHabilidadInsert = {
        NombreHabilidad : "jorgue"
      }
      const mockChamp = {
        ChampID : 1,
        Nombre : "Zed",
        ChampInfo : {},
        Habilidades : []
      }
      const mockHabilidad = {
        HabilidadID : id,
        NombreHabilidad : "noc",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : mockChamp
      }

      habilidadesRespositoryMock.findOne.mockResolvedValue(mockHabilidad);

      mockHabilidad.NombreHabilidad = mockHabilidadInsert.NombreHabilidad;

      habilidadesRespositoryMock.save.mockResolvedValue(mockHabilidad);

      const modifyData = await service.patchHabilidad(mockHabilidadInsert,id)

      expect(habilidadesRespositoryMock.findOne).toHaveBeenCalled();
      expect(habilidadesRespositoryMock.save).toHaveBeenCalledWith(mockHabilidad);
      expect(modifyData).toEqual(mockHabilidad)
    }),
    it("habilidad no encontrada",async()=>{
      const id = 1;
      const mockHabilidadInsert = {
        NombreHabilidad : "jorgue"
      }

      habilidadesRespositoryMock.findOne.mockResolvedValue(null);

      await expect(service.patchHabilidad(mockHabilidadInsert,id)).rejects.toThrow(NotFoundException)
    })
  })
  describe("deleteHability",()=>{
    it("eliminamos una habilidad",async()=>{
      const id = 1;
      const mockChamp = {
        ChampID : 1,
        Nombre : "Zed",
        ChampInfo : {},
        Habilidades : []
      }
      const mockHabilidad = {
        HabilidadID : id,
        NombreHabilidad : "noc",
        Habilidad : HabilidadesTeclas.Pasiva,
        DescripcionHabilidad : "hace algo",
        Champ : mockChamp
      }

      habilidadesRespositoryMock.findOne.mockResolvedValue(mockHabilidad);

      habilidadesRespositoryMock.remove.mockResolvedValue(null)

      await service.deleteHabilidad(id);

      expect(habilidadesRespositoryMock.findOne).toHaveBeenCalled();
      expect(habilidadesRespositoryMock.remove).toHaveBeenCalled();
    })
    it("habilidad no encontrada",async()=>{
      const id = 1;
      habilidadesRespositoryMock.findOne.mockResolvedValue(null);

      await expect(service.deleteHabilidad(id)).rejects.toThrow(NotFoundException)
    })
  })
});
