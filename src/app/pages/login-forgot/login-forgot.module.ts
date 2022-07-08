import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginForgotPageRoutingModule } from './login-forgot-routing.module';
import { LoginForgotPage } from './login-forgot.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';
import { ErrorModule } from 'src/app/components/error/error.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginForgotPageRoutingModule,
    MaterialAppModule,
    ErrorModule
  ],
  declarations: [LoginForgotPage]
})
export class LoginForgotPageModule {}
