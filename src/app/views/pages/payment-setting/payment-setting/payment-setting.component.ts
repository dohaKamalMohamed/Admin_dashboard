import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material';
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
//Upload Image
import { FileUploader } from 'ng2-file-upload';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { paymentSetting } from '../../../../core/auth/_models/paymentsetting.model';
import { paymentService } from '../../../../core/auth/_services/payment.service';
import { Stripe } from '../../../../core/auth/_models/Stripe.model';

import { AlertComponentComponent } from '../../alert-component/alert-component.component'

const URL = 'http://localhost:3000/api/upload';
@Component({
	selector: 'kt-payment-setting',
	templateUrl: './payment-setting.component.html',
	styleUrls: ['./payment-setting.component.scss']
})
export class PaymentSettingComponent implements OnInit, OnDestroy {
	// Public properties
	oldSetting;
	settingForm: FormGroup;
	errorMessage
	hasFormErrors = false;
	settingSubject = new BehaviorSubject<Stripe>(new Stripe());
	selectedTab: number = 0;
	setting: paymentSetting
	currencySettingOptions = [{ name: 'USD_U.S Dollar', value: 'USD' }, { name: 'EUR-Euro', value: 'EUR' }, { name: 'GBP-UK', value: 'GBP' }, { name: 'CAD - Canadian Dollar', value: 'CAD' }, { name: 'AUD-Australian Dollar', value: 'AUD' }, { name: 'JPY-Japanese Yen', value: 'JPY' }, { name: 'BRL-Brazilian Real', value: 'BRL' }, { name: 'MXN-Mexican Peso', value: 'MXN' }, { name: 'SEK-Swedish Krona', value: 'SEK' }, { name: 'CHF-Swiss Franc', value: 'CHF' }, { name: 'SGD-Singapora Dollar', value: 'SGD' }, { name: 'DKK-Danish Krone', value: 'DKK' }, { name: 'CAD-Canadian Dollar', value: 'RUB' }, { name: 'CZK-Czech Koruna', value: 'CZK' }, { name: 'HKD-Hong Kong Dollar', value: 'HKD' }, { name: 'PLN-Polish Zloty', value: 'PLN' }, { name: 'NOK-Norwegian Krone', value: 'NOK' }];
	feesForDonations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'upload' });
	imageprivew;
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
		private paymentService: paymentService,
		private layoutUtilsService: LayoutUtilsService,
		private _ng2ImgMax: Ng2ImgMaxService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.oldSetting = this.setting;
		this.paymentService.getpaymentsInformation().subscribe(res => {
			if (res.success == true) {
				this.setting = res.data;
				this.settingSubject.next({ 'stripe_client_id': this.setting.stripe_client_id, 'stripe_public_key': this.setting.stripe_public_key, 'stripe_secret_key': this.setting.stripe_secret_key });
				this.createForm();
				this.cdr.detectChanges()
			}
		})

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
			currencySetting: [this.setting.currency_code, Validators.required],
			feesForDonations: [this.setting.fee_donation, Validators.required],
			coverProcessingFee: [this.setting.cover_processing_fee, Validators.required],
			coverProcessingFeeMessage: [this.setting.cover_processing_fee_message, Validators.required],
			paymentOptios: [this.setting.enable_stripe],
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
		this.prepareUser();
		this.hasFormErrors = false;
		const controls = this.settingForm.controls;
		console.log(this.settingForm.invalid)
		/** check form */
		if (this.settingForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		const editedSetting = this.prepareUser();
		this.updateSetting(editedSetting, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): paymentSetting {
		const controls = this.settingForm.controls;
		console.log(this.settingForm.controls)
		const _setting = new paymentSetting();
		_setting.currency_code = controls.currencySetting.value;
		_setting.cover_processing_fee = controls.coverProcessingFee.value;
		_setting.fee_donation = controls.feesForDonations.value;
		_setting.cover_processing_fee_message = controls.coverProcessingFeeMessage.value;
		_setting.enable_stripe = controls.paymentOptios.value;
		_setting.stripe_client_id = this.settingSubject.value.stripe_client_id
		_setting.stripe_public_key = this.settingSubject.value.stripe_public_key
		_setting.stripe_secret_key = this.settingSubject.value.stripe_secret_key
		return _setting;
	}

	/**
	 * Add User
	 *
	 * @param _setting: generalSetting
	 * @param withBack: boolean
	 */
	updateSetting(_setting: paymentSetting, withBack: boolean = false) {
		console.log(_setting)
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Update Setting', 'message': 'Are You sure you want to update setting?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.paymentService.updatepaymentsInformation(_setting).subscribe(res => {
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
