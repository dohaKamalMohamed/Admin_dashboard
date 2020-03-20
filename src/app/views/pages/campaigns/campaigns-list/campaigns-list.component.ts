import { select } from '@ngrx/store';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Campaigns } from '../../../../core/auth/_models/Campaigns.model';
import { Members } from '../../../../core/auth/_models/member.model';

import { campaignsService } from '../../../../core/auth/_services/campaigns.service';
import { memberService } from '../../../../core/auth/_services/members.service'
@Component({
	selector: 'kt-campaigns-list',
	templateUrl: './campaigns-list.component.html',
	styleUrls: ['./campaigns-list.component.scss']
})
export class CampaignsListComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['ID', 'Title', 'Goal', 'Status', 'Date', 'Deadline', 'user', 'image', 'Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Campaigns>(true, []);
	CampaignsResult: Campaigns[];
	filteredCampaignsResult: Campaigns[];
	membersList: Members[];
	selectedOrganiztion ='0';
	selectedStatus ='0';
	selectDate;


	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private campaignsService: campaignsService,
		private memberService: memberService
	) { }
	ngOnInit() {
		this.loadOrganizationList()
		this.loadCampaignList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadCampaignList() {
		const campaigns = this.campaignsService.getAllCampaigns().subscribe(res => {
			if (res.success == true) {
				this.CampaignsResult = res.data.data;
				this.dataSource = new MatTableDataSource<Campaigns>(this.CampaignsResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
		})

		this.subscriptions.push(campaigns)

	}

	loadOrganizationList() {
		const members = this.memberService.getmembersInformation().subscribe(res => {
			this.membersList = res.data
		})
		this.subscriptions.push(members)
	}

	filterCampaigns() { 
		this.filteredCampaignsResult = this.CampaignsResult;
		if (this.selectedOrganiztion == '0' && this.selectedStatus == '0' && !this.selectDate) {
			this.dataSource = new MatTableDataSource<Campaigns>(this.filteredCampaignsResult);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}
		else if (this.selectedOrganiztion != '0' && this.selectedStatus != '0' && this.selectDate) {
			this.dataSource = new MatTableDataSource<Campaigns>(this.filteredCampaignsResult.filter(p =>
				p.user_id == this.selectedOrganiztion && p.status == this.selectedStatus &&
				new Date(p.date).toDateString() == this.selectDate.toDateString()));

		}
		else if (this.selectedOrganiztion != '0' || this.selectedStatus != '0' || this.selectDate) {

			if (this.selectedOrganiztion != '0') {
				this.filteredCampaignsResult = this.filteredCampaignsResult.filter(p => p.user_id == this.selectedOrganiztion);
				

			}

			if (this.selectedStatus != '0') {
				this.filteredCampaignsResult = this.filteredCampaignsResult.filter(p => p.status == this.selectedStatus);
				
			} if (this.selectDate) {
				this.filteredCampaignsResult = this.filteredCampaignsResult.filter(p =>
					new Date(p.date).toDateString() == this.selectDate.toDateString());
					
			}
			this.dataSource = new MatTableDataSource<Campaigns>(this.filteredCampaignsResult);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();

		}

	}

	removeDate(){
		this.selectDate=''
	}

	getOrganizationName(id){
		if(this.membersList){
			let organization=this.membersList.find(p=>p.id===id)
			return organization.name
		}
	
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.CampaignsResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.CampaignsResult.length) {
			this.selection.clear();
		} else {
			this.CampaignsResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns Student roles string
	 *

	 *
	 * @param id
	 */
	editCampaign(id) {
		
		this.router.navigate(['./edit', id], { relativeTo: this.activatedRoute });
	}

}


