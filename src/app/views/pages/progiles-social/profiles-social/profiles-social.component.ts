import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { SocialNetworks } from '../../../../core/auth/_models/profileSocial.model';
import { socialProfileService } from '../../../../core/auth/_services/socialprofile.service';
import { AlertComponentComponent } from '../../alert-component/alert-component.component'

@Component({
	selector: 'kt-profiles-social',
	templateUrl: './profiles-social.component.html',
	styleUrls: ['./profiles-social.component.scss']
})
export class ProfilesSocialComponent implements OnInit, OnDestroy {
	// Public properties
	oldsocialProfiles;
	socialProfilesForm: FormGroup;
	hasFormErrors = false;
	socialProfiles: SocialNetworks
	date;
	errorMessage;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param socialProfilesFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private socialProfilesFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private socialProfileService: socialProfileService,
		private cdr: ChangeDetectorRef,
		private dialog:MatDialog

	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.oldsocialProfiles = this.socialProfiles;

		this.socialProfileService.getSocialProfile().subscribe(res => {
			if (res.success == true) {
				this.socialProfiles = res.data;
				this.createForm();
				this.cdr.detectChanges();
			}

		}, error => {

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
		this.socialProfilesForm = this.socialProfilesFB.group({
			googlePlus: [this.socialProfiles.googleplus, Validators.required],
			facebook: [this.socialProfiles.facebook, Validators.required],
			twitter: [this.socialProfiles.twitter, Validators.required],
			instagram: [this.socialProfiles.instagram, Validators.required],

		});
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/socialProfiles/general`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}



	/**
	 * Reset
	 */
	reset() {
		this.socialProfiles = Object.assign({}, this.oldsocialProfiles);
		this.createForm();
		this.hasFormErrors = false;
		this.socialProfilesForm.markAsPristine();
		this.socialProfilesForm.markAsUntouched();
		this.socialProfilesForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.socialProfilesForm.controls;
		/** check form */
		if (this.socialProfilesForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		const editedsocialProfiles = this.prepareUser();
		this.updatesocialProfiles(editedsocialProfiles, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): SocialNetworks {
		const controls = this.socialProfilesForm.controls;
		const _socialProfiles = new SocialNetworks();
		_socialProfiles.googleplus = controls.googlePlus.value;
		_socialProfiles.twitter = controls.twitter.value;
		_socialProfiles.facebook = controls.facebook.value;
		_socialProfiles.instagram = controls.instagram.value;

		return _socialProfiles;
	}

	/**
	 * Add User
	 *
	 * @param _socialProfiles: generalsocialProfiles
	 * @param withBack: boolean
	 */
	updatesocialProfiles(_socialProfiles: SocialNetworks, withBack: boolean = false) {

		
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Update Setting', 'message': 'Are You sure you want to update setting?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				this.socialProfileService.updateSocialProfile(_socialProfiles).subscribe(res => {
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
