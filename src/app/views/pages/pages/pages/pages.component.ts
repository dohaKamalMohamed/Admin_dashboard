// Angular
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Pages } from '../../../../core/auth/_models/Pages.model';
@Component({
  selector: 'kt-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = [ 'ID', 'Title', 'Slug_URL','Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Pages>(true, []);
	PagesResult: Pages[] =
	[
		{ ID:'1' , Title:"Terms-of-service",Slug_URL: "terms-of-service",showNavbar:true,content:'content' },
		{ ID: '2', Title:"About Us",Slug_URL : "about",showNavbar:true,content:'content'},
		{ ID: '3', Title:"Privacy" ,Slug_URL: "privacy",showNavbar:true,content:'content'}
	];
	selectedProvider;
	provider: string;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
	) { }
	ngOnInit() {
		this.loadCourseList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadCourseList() {

				this.dataSource = new MatTableDataSource<Pages>(this.PagesResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();

		}

	}






