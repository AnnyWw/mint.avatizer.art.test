import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint/mint.component';
import { ManageNFTComponent } from './manage-nft/manage-nft.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { MintUglyfacesComponent } from './mint-uglyfaces/mint-uglyfaces.component';
import { ManageUglyfacesComponent } from './manage-uglyfaces/manage-uglyfaces.component';


@NgModule({
  declarations: [
    MintComponent,
    ManageNFTComponent,
    NotFoundComponent,
    MintUglyfacesComponent,
	ManageUglyfacesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
