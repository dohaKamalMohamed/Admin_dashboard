import { Component, OnInit, OnDestroy ,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
     //Upload Image
import { FileUploader } from 'ng2-file-upload';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { SubheaderService } from '../../../../core/_base/layout';
import { Members } from '../../../../core/auth/_models/member.model';
import { memberService } from '../../../../core/auth/_services/members.service';
const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'kt-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent implements OnInit, OnDestroy {
	// Public properties
	oldmember;
	memberForm: FormGroup;
	hasFormErrors = false;
	member: Members

	public uploader:FileUploader= new FileUploader({url: URL, itemAlias: 'upload'});
	imageprivew;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param memberFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private memberFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private _ng2ImgMax: Ng2ImgMaxService,
		private memberService: memberService,
		private subheaderService: SubheaderService,
		private CDR:ChangeDetectorRef
	) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */


	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				let member = this.memberService.getMemberById(id).subscribe(res => {
					if (res.success == true) {
						this.member = res.data
						console.log(this.member)
						this.oldmember = Object.assign({}, this.member);
						this.initcategory();
						this.CDR.detectChanges()
					}
				})

			} else {
				this.member = new Members();
				this.oldmember = Object.assign({}, this.member);
				this.initcategory()
			}
		})
		this.subscriptions.push(routeSubscription)
		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			console.log('ImageUpload:uploaded:', item, status, response);
			alert('File uploaded successfully');
		};
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	createForm() {
		this.memberForm = this.memberFB.group({
		name: [this.member.name, Validators.required],
		email: [this.member.email, Validators.required],
        role: [this.member.role, Validators.required],
        password: [this.member.password, Validators.required],
		});
	}

	initcategory() {
		this.createForm();
		if (!this.member.id) {
			this.subheaderService.setTitle('Create member');
			this.subheaderService.setBreadcrumbs([
				{ title: 'member', page: `members` },
				{ title: 'members', page: `members` },
				{ title: 'Create member', page: `members/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit member');
		this.subheaderService.setBreadcrumbs([
			{ title: 'member ', page: `members` },
			{ title: 'members', page: `members` },
			{ title: 'Edit member', page: `members/edit`, queryParams: { id: this.member.id } }
		]);
	}

	getComponentTitle(){
		if(!this.member.id){
			return 'Create Member'
		}else{
			return 'Edit Member'
		}
	}

	/**
	 * Reset
	 */

	reset() {
		this.member = Object.assign({}, this.oldmember);
		this.createForm();
		this.hasFormErrors = false;
		this.memberForm.markAsPristine();
		this.memberForm.markAsUntouched();
		this.memberForm.updateValueAndValidity();
	}

	/**
	 * Reset
	 */
	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.memberForm.controls;
		/** check form */
		if (this.memberForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		const editedmember = this.prepareUser();
		this.updatemember(editedmember, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): Members {
		const controls = this.memberForm.controls;
		const _member = new Members();
		_member.name = controls.URL.value;
		_member.email = controls.Name.value;
		_member.password = controls.Status.value;
		// _member.Role=controls.Role.value;
		delete _member.id
		return _member;
	}
		/**
	 * Add User
	 *
	 * @param _member: generalmember
	 * @param withBack: boolean
	 */
	updatemember(_member: Members, withBack: boolean = false) {
		console.log(_member)
		/* real backend
let updatemember
this.subscriptions.push(updatemember);
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

	/**
	 * Init user
	 */
	/**
	 * Create form
	 */
	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/member/general`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	handleUpload(event: any) {
		if (event.target.files && event.target.files[0]) {

			var reader = new FileReader();
			reader.onload = (event: ProgressEvent) => { this.imageprivew = (<FileReader>event.target).result; }
			reader.readAsDataURL(event.target.files[0]);
			this._ng2ImgMax.resizeImage(event.target.files[0], 300, 300).subscribe(
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
				},
				error => console.log(error)
			);
		}
	}
}

















