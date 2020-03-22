import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

 //Upload Image
 import { FileUploader } from 'ng2-file-upload';
 import { Ng2ImgMaxService } from 'ng2-img-max'; 
 import { DomSanitizer } from '@angular/platform-browser';
  
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
    
import { Pages } from '../../../../core/auth/_models/Pages.model';
const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'kt-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.scss']
})
export class EditCampaignComponent implements OnInit  , OnDestroy {
	// Public properties
	oldpage;
	pageForm: FormGroup;
	hasFormErrors = false;

	page: Pages 
	public uploader:FileUploader= new FileUploader({url: URL, itemAlias: 'upload'}); 
	imageprivew;
	format;
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
		private _ng2ImgMax: Ng2ImgMaxService,
		private _sanitizer: DomSanitizer,
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
	this.oldpage=	this.page ;
	this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
	this.uploader.onAfterAddingFile = (fileItem) => {
		this.imageprivew = this._sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
	  }
	this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			 console.log('ImageUpload:uploaded:', item, status, response);
			 alert('File uploaded successfully');
	 };
	
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
			title: ['', Validators.required],
			category: ['', Validators.required],
			goal: ['', Validators.required],
			location: ['', Validators.required],
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
		//this.updatepage(editedpage, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser() {
	// 	const controls = this.pageForm.controls;
	// 	const _page = new Pages();
	// 	_page.Slug_URL = controls.Slug_URL.value;
	// 	_page.Title = controls.Title.value;
	// 	_page.showNavbar = controls.showNavbar.value;
   
    // delete _page.ID
	// 	return _page;
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

	handleUpload(event: any) {
		if (event.target.files && event.target.files[0]) {
		 
		  var reader = new FileReader();
		  reader.onload = (event: ProgressEvent) => {this.imageprivew = (<FileReader>event.target).result;}
		  reader.readAsDataURL(event.target.files[0]);
		  console.log(event.target.files[0].type)
		  if(event.target.files[0].type.indexOf('image')> -1){
			  this.format='image'
			  this._ng2ImgMax.resizeImage(event.target.files[0], 800, 300).subscribe(
				result => {
				  const newImage = new File([result], result.name);
				  this.uploader.clearQueue();
				  this.uploader.addToQueue([newImage]);
				  //this.uploader.uploadAll();
				  //console.log(result);
				  reader.onload = (event: ProgressEvent) => {
					this.imageprivew = (<FileReader>event.target).result;
				   
				  }
				  reader.readAsDataURL(event.target.files[0]);
		
				  console.log(this.imageprivew)
		
				},
				error => console.log(error)
			  );
		  }else if(event.target.files[0].type.indexOf('video')> -1){
			this.format='video';
			reader.onload = (event: ProgressEvent) => {
				this.imageprivew = (<FileReader>event.target).result;
				
			}
		//	reader.readAsDataURL(event.target.files[0]);
			//this._sanitizer.bypassSecurityTrustResourceUrl(this.imageprivew)
			console.log('jjjjjjjjjjssssss',this.imageprivew,'jjjjjjjjjjssssss')
		  }
	
		 
		}
	
	
	  }

}
