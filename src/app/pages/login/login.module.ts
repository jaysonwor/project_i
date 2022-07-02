import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';
import { ErrorComponent } from 'src/app/components/error/error.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    MaterialAppModule
  ],
  declarations: [LoginPage, ErrorComponent]
})
export class LoginPageModule {}
