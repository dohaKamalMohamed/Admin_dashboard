import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FileUploadModule } from 'ng2-file-upload';
import { Ng2ImgMaxModule } from 'ng2-img-max';
// Translate
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
import {AlertComponentModule} from '../alert-component/alert-component.module';
import {AlertComponentComponent} from '../alert-component/alert-component.component'
@NgModule({
  declarations: [PagesComponent, EditPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
			{
				path: '',
				component: PagesComponent
			},
			{
				path: 'add',
				component: EditPageComponent
			},
			{
				path: 'edit/:id',
				component: EditPageComponent
			},
		]),FormsModule,
		ReactiveFormsModule,
		AlertComponentModule,
		FileUploadModule,
		Ng2ImgMaxModule,
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

export class PagesModule { }
