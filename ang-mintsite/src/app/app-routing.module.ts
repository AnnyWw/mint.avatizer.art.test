import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageNFTComponent } from './pages/manage-nft/manage-nft.component';
import { MintUglyfacesComponent } from './pages/mint-uglyfaces/mint-uglyfaces.component';
import { MintComponent } from './pages/mint/mint.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ManageUglyfacesComponent } from './pages/manage-uglyfaces/manage-uglyfaces.component';
import { QuadArtComponent } from './pages/quad-art/quad-art.component';

const routes: Routes = [
  { path: '', redirectTo: 'quad-arto', pathMatch: 'full' },
  {
    path: 'quad-arto',
    component: QuadArtComponent,
    title: 'Quad Arto - Manage my collection',
    data: {
      seo: {
        metaTags: [
          {
            name: 'description',
            content: 'Manage my Quad Arto. Pausing or restoring daily reloads.',
          },
        ],
      },
    },
  },
  {
    path: 'manage-ugly-faces',
    component: ManageUglyfacesComponent,
    title: 'Ugly Faces - Manage my collection',
    data: {
      seo: {
        metaTags: [
          {
            name: 'description',
            content: 'Manage my Ugly Faces NFTs. Pausing or restoring daily reloads.',
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
  {
  path: '404',
  component: NotFoundComponent,
  title: 'Avatizer - Page Not Found 404',
    data: {
      seo: {
        metaTags: [
          {
            name: 'description',
            content: 'We are sorry, but the page you are currently looking for is not found.',
          },
        ],
      },
    },
  },

  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
