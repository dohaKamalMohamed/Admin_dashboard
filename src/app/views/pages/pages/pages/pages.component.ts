// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort ,MatDialog } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Pages } from '../../../../core/auth/_models/Pages.model';
import { pagesService } from '../../../../core/auth/_services/Pages.service';

import {AlertComponentComponent} from '../../alert-component/alert-component.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
@Component({
	selector: 'kt-pages',
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['ID', 'Title', 'Slug_URL', 'Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Pages>(true, []);
	PagesResult: Pages[]
	selectedProvider;
	provider: string;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private cdr: ChangeDetectorRef,
		private PagesService: pagesService,
		private layoutUtilsService:LayoutUtilsService
	) { }
	ngOnInit() {
		this.loadPagesList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadPagesList() {
		this.PagesService.getAllpages().subscribe(res => {
			if (res.success) {
				this.PagesResult = res.data;
				this.dataSource = new MatTableDataSource<Pages>(this.PagesResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
				this.cdr.detectChanges()
			}
		})


	}
	deletePage(id){
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Delete Page', 'message': 'Are You sure you want to delete this page?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			let deleteCategorie=this.PagesService.deletePage(id).subscribe(res=>{
					if(res.success==true){
						this.layoutUtilsService.showActionNotification('deleted succefully')
						this.loadPagesList();
						this.cdr.detectChanges()
					}
				})
				this.subscriptions.push(deleteCategorie)
			}
		});

	}
	editPage(id){
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

}






