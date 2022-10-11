import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint/mint.component';
import { ManageNFTComponent } from './manage-nft/manage-nft.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MintComponent,
    ManageNFTComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class PagesModule { }
