import { CroppingSeason, Farm, Dong, SharedFarm, TENANT, UserFarm, CropBreed, Growth } from '@libs/db';
import { UpdateFarmDto, CroppingSeasonDto, Role, UpdateCroppingSeasonDto } from '@libs/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { FindOptionsWhere, In, IsNull, Like, Repository } from 'typeorm';
import { DeviceService } from './device.service';
import { DateUtils } from '@libs/utils';
import { CultureMediumService } from './culture-medium.service';
import { CropBreedService } from './crop-breed.service';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm, TENANT) private farmRepo: Repository<Farm>,
    @InjectRepository(Dong, TENANT) private dongRepo: Repository<Dong>,
    @InjectRepository(UserFarm, TENANT) private userFarmRepo: Repository<UserFarm>,
    @InjectRepository(SharedFarm, TENANT) private sharedFarmRepo: Repository<SharedFarm>,
    @InjectRepository(CroppingSeason, TENANT) private croppingSeasonRepo: Repository<CroppingSeason>,
    @InjectRepository(CropBreed, TENANT) private cropBreedRepo: Repository<CropBreed>,
    @InjectRepository(Growth, TENANT) private growthRepo: Repository<Growth>,
    private cropBreedService: CropBreedService,
    private cultureMediumService: CultureMediumService,
    private deviceService: DeviceService
    ) { }

  async getFarmList(data:any) {
    const { role, userIdx, withDongs } = data;

    let allFarmsPromise, userFarmsPromise, sharedFarmsPromise, menteeFarmsPromise;

    if (role == Role.SUPER_ADMIN || role == Role.ADMIN) {
      //  전체 농장
      allFarmsPromise = this.farmRepo.find({
        relations: {
          dongs: withDongs ? true : false
        },
        where: {
          deleteDt: IsNull()
        }
      });

    } else {
      if (userIdx) {
        // user farms
        userFarmsPromise = new Promise((resolve, reject) => {
          this.userFarmRepo.find({
            // relations: ['userFarm'],
            where: { userIdx: userIdx }
          })
          .then(userFarms => {
            const farmIdxes = userFarms.map(f => f.farmIdx);
            this.farmRepo.find({
              // relations: ['userFarms.userFarm', 'dongs'],
              relations: {
                dongs: withDongs ? true : false
              },
              where: {
                idx: In(farmIdxes),
                deleteDt: IsNull()
              }
            })
            .then(async farms => {
              const convertedFarms = await this.convertEquipmentCodeDataType(farms);
              const newFarm = withDongs ? this.setDeviceDetails(convertedFarms) : convertedFarms;
              resolve(newFarm);
            });
          });
        });

        // shared farms
        sharedFarmsPromise = new Promise((resolve, reject) => {
          this.sharedFarmRepo.find({where: { sharedUserIdx: userIdx}}).then(sharedFarms => {
            const farmIdxes = sharedFarms.map(f => f.idx);
            this.farmRepo.find({
              relations: {
                dongs: withDongs ? true : false
              },
              where: {
                idx: In(farmIdxes)
              }
            }).then(farms => resolve(farms));
          });
        });
//        const sharedFarms = await

      }
      if (role == Role.MENTOR) {
        // 멘티 농장
      }
    }

    const [allFarms, userFarms, sharedFarms, menteeFarms] = await Promise.all([allFarmsPromise, userFarmsPromise, sharedFarmsPromise, menteeFarmsPromise]);

    return {
      allFarms,
      userFarms,
      sharedFarms,
      menteeFarms
    };
  }

  async createUserFarm(data: any){
    const { farmIdx, userIdx, owner } = data;
    const userFarmModel = this.userFarmRepo.create({ farmIdx, userIdx, owner });

    return await this.userFarmRepo.insert(userFarmModel);
  }

  private async setDeviceDetails(farms: Farm[]): Promise<Farm[]> {
    const copiedFarms = [...farms];
    const devices = ['cmDevice', 'exDevice', 'inDevice', 'nuDevice'];

    for(let n = 0; n < copiedFarms.length; n++){
      let dongs = copiedFarms[n].dongs;

      for(let i = 0; i < dongs.length; i++){
        for(let device of devices){
          let deviceIdx = `${device}Idx`;

          if(dongs[i][deviceIdx])
            dongs[i][device] = await this.deviceService.getDeviceByIdx({ idx: dongs[i][deviceIdx] });
        }
      }
    }
    return copiedFarms;
  }

  private convertEquipmentCodeDataType(farms: Farm[]): Farm[] {
    const newFarm = farms.map((farm: any) => {
      if(farm.equipmentCd){
        const string = farm.equipmentCd.replace(/[[\]]/g, "");
        const array = string.split(",");
        farm.equipmentCd = array.map(code => Number(code));
      }
      return farm;
    });
    return newFarm;
  }

  async getDongList(data:any) {
    const role: Role = data.role;
    const userIdx = data.userIdx;

    if (role == Role.SUPER_ADMIN || role == Role.ADMIN) {
      //  전체 농장

    } else {
      // 내농장, 공유받은 농장, 멘티 농장의 리스트를 먼저 구한다
      // 내 농장, 공유받은 농장
      // const farms = await this.userFarmRepo.find({where: {userIdx: userIdx}, relations: ['farms']});
      const farms = await this.getFarmList(data);
      // const farmIdxes = farms.map(f => f.idx);


      if (role == Role.MENTOR) {
        // 멘티 농장
      }
    }

    return this.dongRepo.find();
  }

  async getFarmByUserId(farmId: number) {
    const rs = await this.farmRepo.find({where: {idx: farmId}});
    return rs.map(r => {
      return {
        idx: r.idx,
        name: r.name,
      }
    })
  }

  async getFarmsByUserIdx(userIdx: number) {
    if (userIdx == null) throw Error('No userIdx');
    return await this.userFarmRepo.find({where: { userIdx: userIdx}});
  }

  async getCroppingSeasons(data: any) {
    const { farmIdx } = data;
    const rs = farmIdx ?
      this.getCropBreedByIdx(farmIdx) :
      this.getCroppingSeasonsAndGrowthInvDt(data);

    return rs;
  }

  async getCroppingSeasonsAndGrowthInvDt(data: any) {
    const { farmIdxes } = data;
    const lastInvDtsPromise = this.growthRepo.createQueryBuilder()
      .select(['fcs_idx as csIdx', 'MAX(inv_dt) as lastInvDt'])
      .groupBy('csIdx')
      .getRawMany();

    const whereOption: FindOptionsWhere<CroppingSeason> = {
      deleteDt: IsNull()
    }

    if (farmIdxes && farmIdxes.length > 0) {
      whereOption.farmIdx = In(farmIdxes)
    }

    const rsPromise = this.croppingSeasonRepo.find({
      relations: ['cropBreed', 'farm', 'farm.dongs', 'cropBreed.crop', 'cropBreed.breed'],
      where: whereOption
    });

    const [lastInvDts, rs] = await Promise.all([lastInvDtsPromise, rsPromise]);

    const css = plainToInstance(CroppingSeasonDto, <any[]>instanceToPlain(rs));;
    css.forEach(cs => {
      const lastInvDt = lastInvDts.find(r => r.csIdx == cs.idx);
      cs.lastInvDt = lastInvDt ? DateUtils.format(lastInvDt.lastInvDt, DateUtils.simpleDateFormat) : null;
    });

    return css.filter(cs => cs.farm != null);
  }

  async getCropBreedByIdx(farmIdx: number){
    const rs: CroppingSeason[] = await this.croppingSeasonRepo.find({
      relations: ['cropBreed', 'farm'],
      where: {
        farmIdx,
        deleteDt: IsNull()
      }
    });

    for(let i = 0; i < rs.length; i++){
      let { cropIdx, breedIdx } = rs[i].cropBreed;
      let crop = await this.cropBreedService.getCropsByIdx(cropIdx);
      let breed = await this.cropBreedService.getBreedByIdx(breedIdx);

      rs[i]['cropNm'] = crop.name;
      rs[i]['breedNm'] = breed.name;
    };

    return rs;
  }

  async updateSeason(updateCroppingSeasonDto: UpdateCroppingSeasonDto): Promise<any> {
    const dto = { ...updateCroppingSeasonDto };
    if(!dto.cropBreedIdx){
      const cropBreed = await this.cropBreedRepo.findOne({
        where: {
          cropIdx: dto.cropIdx,
          breedIdx: dto.breedIdx
        }
      });
      dto.cropBreedIdx = cropBreed.idx;
    }
    dto.startDt = dto.startDt ? new Date(dto.startDt) : null;
    dto.endDt = dto.endDt ? new Date(dto.endDt) : null;
    dto.deleteDt = dto.deleteDt ? new Date(dto.deleteDt) : null;
    dto.pinchDt = dto.pinchDt ? new Date(dto.pinchDt) : null;

    const model = this.croppingSeasonRepo.create(dto);

    console.log("model: ", model);

    return await this.croppingSeasonRepo.save(model);
  }

  async deleteFarm(form: any): Promise<any> {
    //실제로 row를 삭제시키면 안된다. deleteDt 필드에 날짜를 넣어줘야한다.
    const copied = { ...form, deleteDt: new Date() };
    const model = this.farmRepo.create(copied);
    return await this.farmRepo.save(model);
  }

  async deleteSeason(form: any): Promise<any> {
    //실제로 row를 삭제시키면 안된다. deleteDt 필드에 날짜를 넣어줘야한다.
    const copied = { ...form, deleteDt: new Date() };
    const model = this.croppingSeasonRepo.create(copied);
    return await this.croppingSeasonRepo.save(model);
  }

  async getMultipleLists(param){
    const entities = param.entities;
    let result;

    for(let i = 0; i < entities.length; i++){
      let data;
      if(entities[i] == 'crops'){
        data = await this.cropBreedService.getCrops();
        result = { ...result, 'crops' : data };
      }
      if(entities[i] == 'breeds'){
        data = await this.cropBreedService.getBreeds();
        result = { ...result, 'breeds' : data };
      }
      if(entities[i] == 'cultureMediums'){
        data = await this.cultureMediumService.getCultureMediums();
        result = { ...result, 'cultureMediums' : data };
      }
    }
    return result;
  }

  async getSharedFarms(idx: any): Promise<any> {
    const sharedIn = this.sharedFarmRepo.find({
      relations: ['farm', 'sharedUser', 'owner'],
      where: { sharedUserIdx: idx }
    });
    const sharedOut = this.sharedFarmRepo.find({
      relations: ['farm', 'sharedUser', 'owner'],
      where: { ownerIdx: idx }
    });
    const [ sharedInFarms, sharedOutFarms ] = await Promise.all([ sharedIn, sharedOut ]);

    return { sharedInFarms, sharedOutFarms };
  }

  async getSharedInFarms(sharedUserIdx: number): Promise<any> {
    return this.sharedFarmRepo.findBy({ sharedUserIdx });
  }

  async getSharedOutFarms(ownerIdx: number): Promise<any> {
    return this.sharedFarmRepo.findBy({ ownerIdx });
  }

  async saveEquipments(idx: number, equipmentCd: string): Promise<any> {
    return this.farmRepo.update(idx, { equipmentCd });
  }
}
