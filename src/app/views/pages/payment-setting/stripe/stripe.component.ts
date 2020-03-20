import { Component, OnInit, OnDestroy , ChangeDetectorRef ,Input } from '@angular/core';
// RxJS
import { BehaviorSubject, fromEvent } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { Stripe } from '../../../../core/auth/_models/Stripe.model';
import { paymentSetting } from '../../../../core/auth/_models/paymentsetting.model';
import {paymentService}  from '../../../../core/auth/_services/payment.service'

@Component({
  selector: 'kt-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit  {
	// Public properties
	@Input() settingSubject: BehaviorSubject<Stripe>;
	oldSetting;
	settingForm: FormGroup;
	hasFormErrors = false;
	setting: Stripe 

	date;
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
		private paymentService:paymentService,
		private cdr: ChangeDetectorRef
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	this.oldSetting=this.setting ;

		let setting = this.paymentService.getpaymentsInformation().subscribe(res=>{
			if (res.success == true) {
				this.setting = res.data;
				this.settingSubject.next(this.setting)
				this.createForm();
				this.settingForm.valueChanges
			.pipe(
				// tslint:disable-next-line:max-line-length
				debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
				distinctUntilChanged(), // This operator will eliminate duplicate values
				tap(() => {
					this.updateSetting();
				})
			)
			.subscribe();
				this.cdr.detectChanges()
			}
		});
		  this.subscriptions.push(setting);
		  
		

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
			stripeClientID: [this.setting.stripe_client_id, Validators.required],
			stripeSecretKey: [this.setting.stripe_secret_key, Validators.required],
			stripePublishableKey: [this.setting.stripe_public_key, Validators.required],
			
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
	

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): Stripe {
		const controls = this.settingForm.controls;
		const _setting = new Stripe();
		_setting.stripe_client_id = controls.stripeClientID.value;
		_setting.stripe_secret_key = controls.stripeSecretKey.value;
		_setting.stripe_public_key = controls.stripePublishableKey.value;
		
		return _setting;
	}

	/**
	 * Add User
	 *
	 * @param _setting: generalSetting
	 * @param withBack: boolean
	 */
	updateSetting() {
		this.hasFormErrors = false;
		const controls = this.settingForm.controls;
		console.log(this.settingForm.controls)
		/** check form */
		if (this.settingForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		const editedSetting = this.prepareUser();
		this.settingSubject.next(editedSetting)
		
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
