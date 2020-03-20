// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort ,MatDialog } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Categorie } from '../../../../core/auth/_models/Categorie.model';
import { categoriesService } from '../../../../core/auth/_services/categorie.service';
import {AlertComponentComponent} from '../../alert-component/alert-component.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';

@Component({
	selector: 'kt-categories-list',
	templateUrl: './categories-list.component.html',
})
export class CategoriesListComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['ID', 'Name','slug', 'Status', 'Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Categorie>(true, []);
	CategorieResult: Categorie[]
	selectedProvider;
	provider: string;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private categoriesService: categoriesService,
		public dialog: MatDialog,
		private layoutUtilsService:LayoutUtilsService
	) { }
	ngOnInit() {
		this.loadCategorieList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadCategorieList() {
		let categories = this.categoriesService.getAllcategories().subscribe(res => {
			if (res.success == true) {
				this.CategorieResult = res.data;
				this.dataSource = new MatTableDataSource<Categorie>(this.CategorieResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
		})
		this.subscriptions.push(categories)
	}

	editCategorie(id){
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}
	
	deleteCategorie(id){
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Delete Category', 'message': 'Are You sure you want to delete this category?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			let deleteCategorie=	this.categoriesService.deleteCategorie(id).subscribe(res=>{
					if(res.status=='success'){
						this.layoutUtilsService.showActionNotification('deleted succefully')
						this.loadCategorieList();
						this.cdr.detectChanges()
					}
				})
				this.subscriptions.push(deleteCategorie)
			}
		});


	}

}







