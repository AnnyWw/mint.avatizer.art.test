import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageNFTComponent } from './pages/manage-nft/manage-nft.component';
import { MintComponent } from './pages/mint/mint.component';

const routes: Routes = [
  { path: '', redirectTo: 'mint', pathMatch: 'full' },
  {
    path: 'mint',
    component: MintComponent,
    title: 'Avatizer - Mint',
    data: {
      seo: {
        metaTags: [
          {
            name: 'description',
            content: 'Avatizer NFT - Free Mint. One NFT per wallet.',
          },
        ],
      },
    },
  },
  {
    path: 'manageNFT',
    component: ManageNFTComponent,
    title: 'Avatizer - Manage my collection',
    data: {
      seo: {
        metaTags: [
          {
            name: 'description',
            content: 'Manage my Avatizers. Pausing or restoring daily reloads.',
          },
        ],
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
