import { EntityRepository, Repository } from "typeorm";
import { Tenant } from "./tenant.entity";

@EntityRepository(Tenant)
export class TenantRepository extends Repository<Tenant> {
  /*
  public static all: Tenant[] = [];
  async loadTenants() {
    TenantRepository.all = await this.find();
  }
  */
   
}