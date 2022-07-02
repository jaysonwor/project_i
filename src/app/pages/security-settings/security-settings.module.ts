import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecuritySettingsPageRoutingModule } from './security-settings-routing.module';

import { SecuritySettingsPage } from './security-settings.page';
import { MaterialAppModule } from 'src/app/ngmaterial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SecuritySettingsPageRoutingModule,
    MaterialAppModule
  ],
  declarations: [SecuritySettingsPage]
})
export class SecuritySettingsPageModule {}
