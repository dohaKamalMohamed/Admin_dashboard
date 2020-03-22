import { Component, OnInit, OnDestroy , ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import {AlertComponentComponent} from '../../alert-component/alert-component.component';
import {MatDialog } from '@angular/material';
    
import { Pages } from '../../../../core/auth/_models/Pages.model';
import { pagesService } from '../../../../core/auth/_services/Pages.service';

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
	page: Pages 
	
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
		private cdr: ChangeDetectorRef,
		private pagesService:pagesService,
		public dialog: MatDialog,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	this.oldpage=	this.page ;

	const routeSubscription = this.activatedRoute.params.subscribe(params => {
		const id = params['id'];
		if (id && id > 0) {
			let category = this.pagesService.getPageByID(id).subscribe(res => {
				if (res.success == true) {
					this.page = res.data
					this.oldpage = Object.assign({}, this.page);
					this.createForm();
					this.cdr.detectChanges()
				}
			})

		} else {
			this.page = new Pages();
			this.oldpage = Object.assign({}, this.page);
			this.createForm();
		}
	})
	this.subscriptions.push(routeSubscription)
	
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
			Slug_URL: [this.page.slug, Validators.required],
			Title: [this.page.title, Validators.required],
			showNavbar: [this.page.show_navbar, Validators.required],
			content: [this.page.content, Validators.required],
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
		if(this.page.id){
			this.updatepage(editedpage, withBack);
		}else{
			this.addPage(editedpage, withBack);
		}
		
	}

	getTitle(){
		if(this.page&&this.page.id){
			return 'Edit Page'
		}else{
			return 'Add New Page'
		}
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser():Pages {
		const controls = this.pageForm.controls;
		const _page = new Pages();
		_page.slug = controls.Slug_URL.value;
		_page.title = controls.Title.value;
		_page.show_navbar = controls.showNavbar.value;
    _page.content= controls.content.value;
    delete _page.id
		return _page;
	}

	/**
	 * Add User
	 *
	 * @param _page: generalpage
	 * @param withBack: boolean
	 */
	updatepage(_page: Pages, withBack: boolean = false) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Update Page', 'message': 'Are You sure you want to update this page?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			let deleteCategorie=this.pagesService.updatePage(this.page.id,_page).subscribe(res=>{
					if(res.success==true){
						this.layoutUtilsService.showActionNotification('updated succefully')
						this.router.navigate(['/pages'])
						this.cdr.detectChanges()
					}
				})
				this.subscriptions.push(deleteCategorie)
			}
		});
		
	}

	addPage(_page: Pages, withBack: boolean = false){
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Add Page', 'message': 'Are You sure you want to add this page?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			let deleteCategorie=this.pagesService.addNewPage(_page).subscribe(res=>{
					if(res.success==true){
						this.layoutUtilsService.showActionNotification('succefully added')
						this.router.navigate(['/pages'])
						this.cdr.detectChanges()
					}
				})
				this.subscriptions.push(deleteCategorie)
			}
		});
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
