import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupConfirmPageRoutingModule } from './signup-confirm-routing.module';

import { SignupConfirmPage } from './signup-confirm.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';
import { ErrorComponent } from 'src/app/components/error/error.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupConfirmPageRoutingModule,
    MaterialAppModule
  ],
  declarations: [SignupConfirmPage, ErrorComponent]
})
export class SignupConfirmPageModule {}
