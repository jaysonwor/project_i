import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MaterialAppModule } from 'src/app/ngmaterial.module';
import { ErrorComponent } from './error.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MaterialAppModule
  ],
  declarations: [ErrorComponent],
  exports: [ErrorComponent]
})
export class ErrorModule {}
