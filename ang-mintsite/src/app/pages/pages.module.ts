import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint/mint.component';
import { ManageNFTComponent } from './manage-nft/manage-nft.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { MintUglyfacesComponent } from './mint-uglyfaces/mint-uglyfaces.component';
import { ManageUglyfacesComponent } from './manage-uglyfaces/manage-uglyfaces.component';
import { QuadArtComponent } from './quad-art/quad-art.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    MintComponent,
    ManageNFTComponent,
    NotFoundComponent,
    MintUglyfacesComponent,
	  ManageUglyfacesComponent,
    QuadArtComponent,
    DragAndDropComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    RecaptchaV3Module,
    ReactiveFormsModule,
    PinchZoomModule
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  ],
})
export class PagesModule { }
