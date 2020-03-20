import { Component, OnInit, OnDestroy , ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { limitsSetting } from '../../../../core/auth/_models/limits.model';
import { generalSettingService } from '../../../../core/auth/_services/generalSetting.service';
import { AlertComponentComponent } from '../../alert-component/alert-component.component';

@Component({
	selector: 'kt-limits',
	templateUrl: './limits.component.html',
})
export class LimitsComponent implements OnInit, OnDestroy {
	// Public properties
	oldSetting;
	settingForm: FormGroup;
	hasFormErrors = false;
	setting: limitsSetting;
	errorMessage
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
		private dialog:MatDialog,
		private cdr:ChangeDetectorRef 

	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.oldSetting = this.setting;

		let setting = this.generalSettingService.getLimitSetting().subscribe(res => {
			if(res.success==true){
        this.setting = res.data;
			this.createForm();
			this.cdr.detectChanges();
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
			numberOfCampaignsToShow: [this.setting.result_request, Validators.required],
			allowedFileSize: [this.setting.file_size_allowed, Validators.required],
			minimumAmountOfCampaign: [this.setting.min_campaign_amount, Validators.required],
			maxAmountOfCampaign: [this.setting.max_campaign_amount, Validators.required],
			minimumAmountOfDonations: [this.setting.min_donation_amount, Validators.required],
			maxAmountOfDonations: [this.setting.max_donation_amount, Validators.required],
		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/setting/general`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}



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
		this.updateSetting(editedSetting, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): limitsSetting {
		const controls = this.settingForm.controls;
		const _setting = new limitsSetting();
		_setting.result_request = controls.numberOfCampaignsToShow.value;
		_setting.file_size_allowed = controls.allowedFileSize.value;
		_setting.min_campaign_amount = controls.minimumAmountOfCampaign.value;
		_setting.max_campaign_amount = controls.maxAmountOfCampaign.value;
		_setting.min_donation_amount = controls.minimumAmountOfDonations.value;
		_setting.max_donation_amount = controls.maxAmountOfDonations.value;
		return _setting;
	}

	/**
	 * Add User
	 *
	 * @param _setting: generalSetting
	 * @param withBack: boolean
	 */
	updateSetting(_setting: limitsSetting, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Update Setting', 'message': 'Are You sure you want to update setting?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.generalSettingService.updateLimitSetting(_setting).subscribe(res => {
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
