import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DndDirective } from './directives/dnd.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DndDirective
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    DndDirective
  ],
  providers: [],
})
export class SharedModule {}
