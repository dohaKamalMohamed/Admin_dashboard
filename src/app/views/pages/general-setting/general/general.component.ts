import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { generalSettingService } from '../../../../core/auth/_services/generalSetting.service';
import { generalSetting } from '../../../../core/auth/_models/generalSetting.model'
import { AlertComponentComponent } from '../../alert-component/alert-component.component';

@Component({
	selector: 'kt-general',
	templateUrl: './general.component.html',
})
export class GeneralComponent implements OnInit, OnDestroy {
	// Public properties
	oldSetting;
	settingForm: FormGroup;
	hasFormErrors = false;
	setting: generalSetting
	date;
	errorMessage;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param settingFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private settingFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private generalSettingService: generalSettingService,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.oldSetting = this.setting;
		let setting = this.generalSettingService.getAllSetting().subscribe(res => {
			if (res.success == true) {
				this.setting = res.data;
				this.createForm();
				this.cdr.detectChanges()
			}

		});
		this.subscriptions.push(setting)


	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init user
	 */


	/**
	 * Create form
	 */
	createForm() {
		this.settingForm = this.settingFB.group({
			siteName: [this.setting.title, Validators.required],
			welcomeText: [this.setting.welcome_text, Validators.required],
			welcomeSubtitle: [this.setting.welcome_subtitle, Validators.required],
			keyWords: [this.setting.keywords, Validators.required],
			noreplayEmail: [this.setting.email_no_reply, Validators.required],
			adminEmail: [this.setting.email_admin, Validators.required],
			linkToTerms: [this.setting.link_terms, Validators.required],
			linkToPrivacyPolicy: [this.setting.link_privacy, Validators.required],
			currencyPosition: [this.setting.currency_position, Validators.required],
			autoApprove: [this.setting.auto_approve_campaigns, Validators.required],
			captcha: [this.setting.captcha, Validators.required],
			emailVerification: [this.setting.email_verification, Validators.required],
			dateFormate: [this.setting.date_format, Validators.required],
			descrition: [this.setting.description, Validators.required],
		});
	}

	/**
	 * Redirect to list
	 *
	 */




	/**
	 * Reset
	 */
	reset() {
		this.setting = Object.assign({}, this.oldSetting);
		this.createForm();
		this.hasFormErrors = false;
		this.settingForm.markAsPristine();
		this.settingForm.markAsUntouched();
		this.settingForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.settingForm.controls;
		/** check form */
		if (this.settingForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		const editedSetting = this.prepareUser();
		this.updateSetting(editedSetting);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): generalSetting {
		const controls = this.settingForm.controls;
		const _setting = new generalSetting();
		_setting.title = controls.siteName.value;
		_setting.welcome_text = controls.welcomeText.value;
		_setting.welcome_subtitle = controls.welcomeSubtitle.value;
		_setting.keywords = controls.keyWords.value;
		_setting.email_no_reply = controls.noreplayEmail.value;
		_setting.email_admin = controls.adminEmail.value;
		_setting.link_terms = controls.linkToTerms.value;
		_setting.link_privacy = controls.linkToPrivacyPolicy.value;
		_setting.currency_position = controls.currencyPosition.value;
		_setting.auto_approve_campaigns = controls.autoApprove.value;
		_setting.captcha = controls.captcha.value;
		_setting.email_verification = controls.emailVerification.value;
		_setting.date_format = controls.dateFormate.value;
		_setting.description = controls.descrition.value
		return _setting;
	}

	/**
	 * Add User
	 *
	 * @param _setting: generalSetting
	 * @param withBack: boolean
	 */
	updateSetting(_setting: generalSetting) {

		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Update Setting', 'message': 'Are You sure you want to update setting?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.generalSettingService.updateSetting(_setting).subscribe(res => {
					if (res.success == true) {
						this.layoutUtilsService.showActionNotification('Saved Succefully');
						this.router.navigateByUrl('/dashboard')
						this.cdr.detectChanges()
					} else {
						this.errorMessage = res.message;
						this.cdr.detectChanges()
					}
				}, error => {
					this.errorMessage = error.errors
					this.cdr.detectChanges()
				})
			}
		})

	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

}
