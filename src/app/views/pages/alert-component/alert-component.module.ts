import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponentComponent} from './alert-component.component';
import {
	
	MatButtonModule,
	

} from '@angular/material';


@NgModule({
  declarations: [AlertComponentComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class AlertComponentModule { }
