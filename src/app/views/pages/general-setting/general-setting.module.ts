import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
import {AlertComponentComponent} from '../alert-component/alert-component.component'
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
import { PartialsModule } from '../../partials/partials.module';

import { GeneralComponent } from './general/general.component';
import { LimitsComponent } from './limits/limits.component';
import { SettingComponent } from './setting/setting.component';
import {AlertComponentModule} from '../alert-component/alert-component.module'
// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';



@NgModule({
  declarations: [GeneralComponent, LimitsComponent, SettingComponent],
  imports: [
    CommonModule,
    FormsModule, 
    AlertComponentModule,
    ReactiveFormsModule,
    HttpClientModule,
    PartialsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingComponent,
        children: [
          {
            path: '',
            redirectTo: 'general',
            pathMatch: 'full',


          },
          {
            path: 'general',
            component: GeneralComponent,

          },
          {
            path: 'limits',
            component: LimitsComponent,
          }
        ]
      },
    ]),


    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatNativeDateModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
		ActionNotificationComponent,AlertComponentComponent
	],
})

export class GeneralSettingModule { }
