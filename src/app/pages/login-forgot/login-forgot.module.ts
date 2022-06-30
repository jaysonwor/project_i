import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginForgotPageRoutingModule } from './login-forgot-routing.module';

import { LoginForgotPage } from './login-forgot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginForgotPageRoutingModule
  ],
  declarations: [LoginForgotPage]
})
export class LoginForgotPageModule {}
