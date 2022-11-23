import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageNFTComponent } from './pages/manage-nft/manage-nft.component';
import { MintUglyfacesComponent } from './pages/mint-uglyfaces/mint-uglyfaces.component';
import { MintComponent } from './pages/mint/mint.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'mint-uglyfaces', pathMatch: 'full' },
  
  {
    path: 'mint-uglyfaces',
    component: MintUglyfacesComponent,
    title: 'Ugly Faces – unusual and modern generative NFT art',
    data: {
      seo: {
        metaTags: [
          {
            name: 'description',
            content: "Ugly Faces intrigue with their unusual and modern art. There’s also a major advantage in the fact that Ugly Faces are a generative art project!",
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
