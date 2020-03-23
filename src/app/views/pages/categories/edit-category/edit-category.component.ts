import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { SubheaderService } from '../../../../core/_base/layout';
//Upload Image
import { FileUploader } from 'ng2-file-upload';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatDialog } from '@angular/material';

import { Categorie } from '../../../../core/auth/_models/Categorie.model';
import { categoriesService } from '../../../../core/auth/_services/categorie.service';
import { AlertComponentComponent } from '../../alert-component/alert-component.component';
const URL = 'https://sandbox.donatetogo.org/api/admin/categories';

@Component({
	selector: 'kt-edit-category',
	templateUrl: './edit-category.component.html',
	styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
	// Public properties
	oldcategory;
	categoryForm: FormGroup;
	hasFormErrors = false;
	category: Categorie
	@ViewChild('input_image', { static: false }) input_image: ElementRef;
	public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'upload' });
	imageprivew;
	errorMessage;
	selectedFile
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param categoryFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		private router: Router,
		private categoryFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private _ng2ImgMax: Ng2ImgMaxService,
		private categoriesService: categoriesService,
		private subheaderService: SubheaderService,
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
		const routeSubscription = this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				let category = this.categoriesService.getCategorieById(id).subscribe(res => {
					if (res.success == true) {
						this.category = res.data
						this.oldcategory = Object.assign({}, this.category);
						this.initcategory();
						this.cdr.detectChanges()
					}
				})

			} else {
				this.category = new Categorie();
				this.oldcategory = Object.assign({}, this.category);
				this.initcategory()
			}
		})
		this.subscriptions.push(routeSubscription)
		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			console.log('ImageUpload:uploaded:', item, status, response);
			
		};
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
		this.categoryForm = this.categoryFB.group({
			name: [this.category.name, Validators.required],
			slug: [this.category.slug, Validators.required],
			mode: [this.category.mode, Validators.required],
			image:[this.category.image]
		});
	}

	initcategory() {
		this.createForm();
		if (!this.category.id) {
			this.subheaderService.setTitle('Create category');
			this.subheaderService.setBreadcrumbs([
				{ title: 'category', page: `categorys` },
				{ title: 'categorys', page: `categorys` },
				{ title: 'Create category', page: `categorys/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit category');
		this.subheaderService.setBreadcrumbs([
			{ title: 'category ', page: `categorys` },
			{ title: 'categorys', page: `categorys` },
			{ title: 'Edit category', page: `categorys/edit`, queryParams: { id: this.category.id } }
		]);
	}

	/**
	 * Reset
	 */
	reset() {
		this.category = Object.assign({}, this.oldcategory);
		this.createForm();
		this.hasFormErrors = false;
		this.categoryForm.markAsPristine();
		this.categoryForm.markAsUntouched();
		this.categoryForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit() {
		
		this.hasFormErrors = false;
		const controls = this.categoryForm.controls;
		/** check form */
		if (this.categoryForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		const editedcategory = this.prepareUser();
		const editedCategory : FormData = new FormData();
		console.log('hhhhhhhhhhhhhhhhhhhhhh',editedcategory,editedcategory.image,editedcategory.image.name)
		editedCategory.append('name',editedcategory.name)
		editedCategory.append('slug',editedcategory.slug)
		editedCategory.append('mode',editedcategory.mode)
		editedCategory.append('image',editedcategory.image,editedcategory.image.name)
		console.log(editedCategory)
		if (this.category.id) {
			
			this.updatecategory(editedCategory);
		} else {
			this.createNewCategory(editedCategory)
		}

	}
	/**
	 * Returns prepared data for save
	 */
	prepareUser(): Categorie {
		const controls = this.categoryForm.controls;
		const _category = new Categorie();
		_category.name = controls.name.value;
		_category.slug = controls.slug.value;
		_category.mode = controls.mode.value;
		if(controls.image.value){
			_category.image=controls.image.value
		}else{
			delete _category.image
		}
		
		delete _category.id
		return _category;
	}

	/**
	 * Add User
	 *
	 * @param _category: generalcategory
	 * @param withBack: boolean
	 */
	updatecategory(category) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Delete Category', 'message': 'Are You sure you want to delete this category?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				let postCategorie = this.categoriesService.updateCategory(this.category.id, category).subscribe(res => {
					if (res.success == true) {
						this.layoutUtilsService.showActionNotification('Category Updated Succefully');
						this.router.navigateByUrl('/categories')
						this.cdr.detectChanges()
					} else {
						this.errorMessage = res
						this.cdr.detectChanges()
					}
				}, error => {
					this.errorMessage = error.error.errors.slug
					this.cdr.detectChanges()
				})
				this.subscriptions.push(postCategorie)
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

	createNewCategory(category) {
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Delete Category', 'message': 'Are You sure you want to delete this category?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
				let postCategorie = this.categoriesService.postCategorie(category).subscribe(res => {
					if (res.success == true) {
						this.layoutUtilsService.showActionNotification('Category Saved Succefully');
						this.router.navigateByUrl('/categories')
						this.cdr.detectChanges()
					} else {
						this.errorMessage = res
						this.cdr.detectChanges()
					}
				}, error => {
					console.log(error)
					this.errorMessage = error.error.errors
					this.cdr.detectChanges()
				})
				this.subscriptions.push(postCategorie)
			}
		});
	}

	handleUpload(event: any) {
		 if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.onload = (event: ProgressEvent) => { this.imageprivew = (<FileReader>event.target).result; }
			reader.readAsDataURL(event.target.files[0]);
			this._ng2ImgMax.resizeImage(event.target.files[0], 300, 300).subscribe(
				result => {

					const file = <File>event.target.files[0];
					this.selectedFile=<File>event.target.files[0];
		 	         this.categoryForm.controls['image'].setValue(file, {emitModelToViewChange: false})
					const newImage = new File([result], result.name);
					this.uploader.clearQueue();
					this.uploader.addToQueue([newImage]);
					
					reader.onload = (event: ProgressEvent) => {
						this.imageprivew = (<FileReader>event.target).result;
						
						console.log(this.categoryForm.controls['image'].value )
					}
					reader.readAsDataURL(event.target.files[0]);
					this.cdr.detectChanges()

				},
				error => console.log(error)
			);
		 }
	}
}
