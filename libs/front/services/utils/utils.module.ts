import { NgModule } from '@angular/core';
import { FuseUtilsService } from '@front/services/utils/utils.service';

@NgModule({
    providers: [
        FuseUtilsService
    ]
})
export class FuseUtilsModule
{
    /**
     * Constructor
     */
    constructor(private _fuseUtilsService: FuseUtilsService)
    {
    }
}
