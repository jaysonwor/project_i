import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PasswordResetPageRoutingModule } from './password-reset-routing.module';
import { PasswordResetPage } from './password-reset.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';
import { ErrorModule } from 'src/app/components/error/error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PasswordResetPageRoutingModule,
    MaterialAppModule,
    ErrorModule
  ],
  declarations: [PasswordResetPage]
})
export class PasswordResetPageModule {}
