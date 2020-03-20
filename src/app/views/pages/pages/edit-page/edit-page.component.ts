import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
    
import { Pages } from '../../../../core/auth/_models/Pages.model'

@Component({
  selector: 'kt-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
	// Public properties
	oldpage;
	pageForm: FormGroup;
	hasFormErrors = false;

	page: Pages = {
		ID:'15',
    Title:'Cover processing fee',
		Slug_URL:'http://localhost:3000/api/upload',
		showNavbar:true
		,content:'content'
	} //remove that in real back end;
	
	
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param pageFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private pageFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	this.oldpage=	this.page ;
	
		this.createForm();
		//real backend
		/*let page = this.generalpageService.getGeneralpage().subscribe(res=>{
			this.page =res;
			this.createForm();
		});
		  this.subscriptions.push(page)
		*/

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
		this.pageForm = this.pageFB.group({
			Slug_URL: [this.page.Slug_URL, Validators.required],
			Title: [this.page.Title, Validators.required],
			showNavbar: [this.page.showNavbar, Validators.required],
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
		this.page = Object.assign({}, this.oldpage);
		this.createForm();
		this.hasFormErrors = false;
		this.pageForm.markAsPristine();
		this.pageForm.markAsUntouched();
		this.pageForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.pageForm.controls;
		/** check form */
		if (this.pageForm.invalid) {
			Object.keys(controls).forEach(controlTitle =>
				controls[controlTitle].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		const editedpage = this.prepareUser();
		this.updatepage(editedpage, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): Pages {
		const controls = this.pageForm.controls;
		const _page = new Pages();
		_page.Slug_URL = controls.Slug_URL.value;
		_page.Title = controls.Title.value;
		_page.showNavbar = controls.showNavbar.value;
   
    delete _page.ID
		return _page;
	}

	/**
	 * Add User
	 *
	 * @param _page: generalpage
	 * @param withBack: boolean
	 */
	updatepage(_page: Pages, withBack: boolean = false) {
		console.log(_page)
		/* real backend
let updatepage
this.subscriptions.push(updatepage);
*/
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
