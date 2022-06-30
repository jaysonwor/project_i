import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginForgotPage } from './login-forgot.page';

const routes: Routes = [
  {
    path: '',
    component: LoginForgotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginForgotPageRoutingModule {}
