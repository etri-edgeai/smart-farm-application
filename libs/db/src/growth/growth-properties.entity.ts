import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'growth_property' })
export class GrowthProperty {
  @PrimaryGeneratedColumn()
  code?: number;

  @Column({ name: 'name' })
  name?: string;
  @Column({ name: 'alias' })
  _alias?: string;
  alias?: string[];
  @Column({ name: 'unit' })
  unit?: string;
  @Column({ name: 'lower' })
  lower?: number;
  @Column({ name: 'upper' })
  upper?: number;
  @Column({ name: 'priority' })
  priority?: number;
  @Column({ name: 'crops' })
  _crops?: string;
  crops?: number[];

  @Column({ name: 'after_pinch_disabled' })
  afterPinchDisabled: boolean;

  @Column({ name: 'predictable' })
  predictable: boolean;

  @Column({ name: 'UPDATE_DT' })
  updateDt?: Date;
  @Column({ name: 'CREATE_DT' })
  createDt?: Date;

  @BeforeInsert()
  beforeInsert() {
    this.cropsToString();
    const now = new Date();
    this.createDt = now;
    this.updateDt = now;
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.cropsToString();
    const now = new Date();
    this.updateDt = now;
  }

  cropsToString() {
    if (this.crops && this.crops.length > 0) {
      this._crops = this.crops.join(',');
    }
  }

  aliasToArray() {
    if (this.alias && this.alias.length > 0) {
      this._alias = this.alias.join(',');
    }
  }

  parseCrops() {
    if (this._crops) {
      this.crops = this._crops.replace('[', '').replace(']', '').split(',').map(val => +val);
    } else {
      this.crops = []
    }
  }

  parseAlias() {
    if (this._alias) {
      this.alias = this._alias.replace('[', '').replace(']', '').split(',');
    } else {
      this.alias = []
    }
  }

  @AfterLoad()
  afterLoad() {
    this.parseCrops();
    this.parseAlias();
  }

}
