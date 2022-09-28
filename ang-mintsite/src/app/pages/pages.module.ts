import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint/mint.component';
import { ManageNFTComponent } from './manage-nft/manage-nft.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MintComponent,
    ManageNFTComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PagesModule { }
