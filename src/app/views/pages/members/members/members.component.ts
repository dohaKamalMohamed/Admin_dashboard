0
import { Component, OnInit,ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort ,MatDialog } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Members } from '../../../../core/auth/_models/member.model';
import { memberService } from '../../../../core/auth/_services/members.service';
import {AlertComponentComponent} from '../../alert-component/alert-component.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
@Component({
  selector: 'kt-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = [ 'id', 'name','email','date','Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Members>(true, []);
	MembersResult: Members[]
	selectedProvider;
	selectDate;
	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private memberService: memberService,
		public dialog: MatDialog,
		private layoutUtilsService:LayoutUtilsService
	) { }

	ngOnInit() {
		this.loadMemberList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadMemberList() {
		let members = this.memberService.getmembersInformation().subscribe(res => {
				this.MembersResult = res.data;
				this.dataSource = new MatTableDataSource<Members>(this.MembersResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
         })
          	this.subscriptions.push(members)
           }

		public doFilter = (value: string) => {
			this.dataSource.filter = value.trim().toLocaleLowerCase();
		}

		isAllSelected(): boolean {
			const numSelected = this.selection.selected.length;
			const numRows = this.MembersResult.length;
			return numSelected === numRows;
		}
		/**
		 * Toggle selection
		 */
		masterToggle() {
			if (this.selection.selected.length === this.MembersResult.length) {
				this.selection.clear();
			} else {
				this.MembersResult.forEach(row => this.selection.select(row));
			}
		}
		/* UI */
		/**
		 * Returns Student roles string
		 *
		 *
		 * @param id
		 */

		editMember(id){
			this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
		}

		filterByProvider() {
			if (this.selectedProvider == '') {
				this.dataSource = new MatTableDataSource<Members>(this.MembersResult)
			} else {
				this.dataSource = new MatTableDataSource<Members>(this.MembersResult.filter(p => p.id == this.selectedProvider));
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
		}

		filterByDate() {
			if (this.selectDate == '') {
				this.dataSource = new MatTableDataSource<Members>(this.MembersResult)
			} else {
				this.dataSource = new MatTableDataSource<Members>(this.MembersResult.filter(p => p.date == this.selectDate.toString()));
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
		}
	}


