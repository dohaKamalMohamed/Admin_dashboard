import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampaignReportedComponent } from './campaign-reported/campaign-reported.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
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

import { FetchEntityDialogComponent } from '../../partials/content/crud';
import { ActionNotificationComponent } from '../../partials/content/crud';
import {AlertComponentComponent} from '../alert-component/alert-component.component';
import {AlertComponentModule} from '../alert-component/alert-component.module'

@NgModule({
  declarations: [CampaignReportedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
			{
				path: '',
				component: CampaignReportedComponent
			},
		]),FormsModule,
		AlertComponentModule,
		ReactiveFormsModule,
		HttpClientModule,
		TranslateModule,
		PartialsModule,
		//angular material
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
		  },
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	  ],
	  entryComponents: [
		FetchEntityDialogComponent,
		ActionNotificationComponent,
		AlertComponentComponent
	  ],
	 })

export class CampaignsReportedModule { }
