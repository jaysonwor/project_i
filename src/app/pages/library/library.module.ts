import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LibraryPageRoutingModule } from './library-routing.module';
import { LibraryPage } from './library.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibraryPageRoutingModule,
    MaterialAppModule
  ],
  declarations: [LibraryPage]
})
export class LibraryPageModule {}
