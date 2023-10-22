

import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: 'daily_farm' })
export class DailyFarm {
    @PrimaryColumn({ name: 'FD_FARM_IDX', comment: '농장번호' })
    farmIdx?: number;
    @PrimaryColumn({ name: 'FD_DAY_KEY', comment: '날짜키' })
    dayKey?: number;

    @Column({ name: 'CHECKED_FLAG', comment: '체크여부' })
    checkedFlag?: string;

    @Column({ name: 'FD_CS_IDX', comment: '작기번호' })
    csIdx?: number;

    @Column({ name: 'TEMP_DAWN', type: 'double', comment: '새벽평균 온도' })
    tempDawn?: number;
    @Column({ name: 'TEMP_DAY', type: 'double', comment: '낮평균 온도' })
    tempDay?: number;
    @Column({ name: 'TEMP_NIGHT', type: 'double', comment: '밤평균 온도' })
    tempNight?: number;

    @Column({ name: 'TEMP_AVG_DAY', type: 'double', comment: '일평균 온도(건구온도)' })
    tempAvgDay?: number;
    @Column({ name: 'TEMP_AVG_DT', type: 'double', comment: '주간평균 온도' })
    tempAvgDayTime?: number;
    @Column({ name: 'TEMP_AVG_NT', type: 'double', comment: '야간평균 온도' })
    tempAvgNightTime?: number;

    @Column({ name: 'TEMP_MAX_DAY', type: 'double', comment: '일최고 온도' })
    tempMaxDay?: number;
    @Column({ name: 'TEMP_MAX_DT', type: 'double', comment: '주간최고 온도' })
    tempMaxDayTime?: number;
    @Column({ name: 'TEMP_MAX_NT', type: 'double', comment: '야간최고 온도' })
    tempMaxNightTime?: number;

    @Column({ name: 'TEMP_MIN_DAY', type: 'double', comment: '일최저 온도' })
    tempMinDay?: number;
    @Column({ name: 'TEMP_MIN_DT', type: 'double', comment: '주간최저 온도' })
    tempMinDayTime?: number;
    @Column({ name: 'TEMP_MIN_NT', type: 'double', comment: '야간최저 온도' })
    tempMinNightTime?: number;
    @Column({ name: 'TEMP_DIFF_DN', type: 'double', comment: '주야간차 온도' })
    tempDiffDayNight?: number;
        
    
    @Column({ name: 'SIE_WET_BULB_TEMP', type: 'double', comment: '습구 온도'})
    wetBulbTemp?: number; 
    @Column({ name: 'SIE_CM_TEMP', comment: '근권(배지)온도'})
    cultureMediumTemp?: number; 
    @Column({ name: 'SIE_HUMIDITY', type: 'double', comment: '상대 습도'})
    humidity?: number; 
    @Column({ name: 'SIE_CO2', type: 'double', comment: 'co2'})
    co2?: number; 
    @Column({ name: 'SIE_SOLAR_RADIANTION', type: 'double', comment: '일사'})
    solarRadiation?: number; 
    @Column({ name: 'SIE_LIGHTNESS', type: 'double', comment: '광량'})
    lightness?: number; 

    @Column({ name: 'SIE_HD', type: 'double', comment: '수분부족분(HD)'})
    humidityDeficit?: number; 
    @Column({ name: 'SIE_ABS_WATER', comment: '절대수분량'})
    absoluteWaterContent?: number;     
    @Column({ name: 'SIE_DEW_POINT_TEMP', type: 'double', comment: '이슬점 온도'})
    dewPointTemp?: number; 

    @Column({ name: 'SNS_WATERING', type: 'double', comment: '급액량' })
    watering?: number;            
    @Column({ name: 'SNS_DRAINAGE', type: 'double', comment: '배액량' })
    drainage?: number; 

    @Column({ name: 'SEWS_TEMP', type: 'double', comment: '외부 온도(건구)' })
    ext_temp?: number;            
    @Column({ name: 'SEWS_HUMIDITY', type: 'double', comment: '외부 습도'})
    ext_humidity?: number; 
    @Column({ name: 'SEWS_WIND_DIRECTION', comment: '풍향' })
    ext_windDirection?: number; 
    @Column({ name: 'SEWS_WIND_SPEED', type: 'double', comment: '풍속'})
    ext_windSpeed?: number; 
    @Column({ name: 'SEWS_RAINFALL', type: 'double', comment: '강우량'})
    ext_rainFall?: number;
    @Column({ name: 'SEWS_SOLAR_RADIATION', type: 'double', comment: '일사'})
    ext_solarRadiation?: number;
}