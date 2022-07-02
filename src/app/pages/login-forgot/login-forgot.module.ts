import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginForgotPageRoutingModule } from './login-forgot-routing.module';
import { LoginForgotPage } from './login-forgot.page';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { MaterialAppModule } from 'src/app/ngmaterial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginForgotPageRoutingModule,
    MaterialAppModule
  ],
  declarations: [LoginForgotPage, ErrorComponent]
})
export class LoginForgotPageModule {}
