import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupConfirmPage } from './signup-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: SignupConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupConfirmPageRoutingModule {}
