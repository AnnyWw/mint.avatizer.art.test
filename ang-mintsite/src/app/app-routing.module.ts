import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageNFTComponent } from './pages/manage-nft/manage-nft.component';
import { MintComponent } from './pages/mint/mint.component';

const routes: Routes = [
  { path: "", redirectTo: "mint", pathMatch: "full" },
  { path: "mint", component: MintComponent },
  { path: "manageNFT", component: ManageNFTComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
