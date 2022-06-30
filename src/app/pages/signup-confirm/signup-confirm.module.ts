import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupConfirmPageRoutingModule } from './signup-confirm-routing.module';

import { SignupConfirmPage } from './signup-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupConfirmPageRoutingModule
  ],
  declarations: [SignupConfirmPage]
})
export class SignupConfirmPageModule {}
