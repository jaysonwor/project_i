import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { SanitizerPipe } from '../../pipes/sanitizer.pipe'
import { ErrorComponent } from 'src/app/components/error/error.component';
import { MaterialAppModule } from 'src/app/ngmaterial.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    MaterialAppModule
  ],
  declarations: [ProfilePage, SanitizerPipe, ErrorComponent]
})
export class ProfilePageModule {}
