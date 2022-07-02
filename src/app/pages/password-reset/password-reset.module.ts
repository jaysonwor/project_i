import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PasswordResetPageRoutingModule } from './password-reset-routing.module';
import { PasswordResetPage } from './password-reset.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';
import { ErrorComponent } from 'src/app/components/error/error.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PasswordResetPageRoutingModule,
    MaterialAppModule
  ],
  declarations: [PasswordResetPage, ErrorComponent]
})
export class PasswordResetPageModule {}
