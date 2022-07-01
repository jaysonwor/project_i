import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
  ],
  exports: [
    CommonModule,
    InputTextModule,
  ]
})
export class PrimeAppModule { }