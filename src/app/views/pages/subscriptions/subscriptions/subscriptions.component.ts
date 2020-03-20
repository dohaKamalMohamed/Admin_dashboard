import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Subscriptions } from '../../../../core/auth/_models/Subscriptions.model';
import { subscriptionsService } from '../../../../core/auth/_services/subscriptions.service';
import { campaignsService } from '../../../../core/auth/_services/campaigns.service';
import { memberService } from '../../../../core/auth/_services/members.service';
import { Campaigns } from '../../../../core/auth/_models/Campaigns.model';
import { Members } from '../../../../core/auth/_models/member.model';

@Component({
	selector: 'kt-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['ID', 'Amount', 'Organization', 'Campaign', 'status','StartDate','current_period_start','current_period_end'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Subscriptions>(true, []);
	SubscriptionsResult: Subscriptions[];
	filterSubscriptionsResult: Subscriptions[];
	CampaignsResult: Campaigns[];
	membersList: Members[];
	totalPayment=0;
	selectedOrganiztion=0 
	selectedCampaign=0
	// Subscriptions
	private subscriptions: Subscription[] = [];
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private subscriptionsService: subscriptionsService,
		private campaignsService: campaignsService,
		private memberService: memberService
	) { }
	ngOnInit() {
		this.loadSubscriptionList();
		this.loadOrganizationList()
		this.loadCampaignList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadSubscriptionList() {
		this.subscriptionsService.getSubscriptions().subscribe(res => {
			if (res.success == true) {
				this.SubscriptionsResult = res.data.data;
				this.dataSource = new MatTableDataSource<Subscriptions>(this.SubscriptionsResult);
				this.totalPayment= this.SubscriptionsResult.reduce((a, b) => +a + +b.amount, 0);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
		})

	}

	loadCampaignList() {
		const campaigns = this.campaignsService.getAllCampaigns().subscribe(res => {
			if (res.success == true) {
				this.CampaignsResult = res.data.data;
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

	public doFilter = (value: string) => {
		this.dataSource.filter = value.trim().toLocaleLowerCase();
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.SubscriptionsResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.SubscriptionsResult.length) {
			this.selection.clear();
		} else {
			this.SubscriptionsResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns Student roles string
	 *
	 * @param id
	 */
	editCourse(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
	}

	getOrgName(id){
		if(this.membersList){
			let organization=this.membersList.find(p=>p.id===id)
			return organization.name
		}
	}

	getCampaignName(id){
		if(this.CampaignsResult){
			let campaign=this.CampaignsResult.find(p=>p.id===id)
			return campaign.title
		}
	}

	filterDonation(){
		
		this.filterSubscriptionsResult = this.SubscriptionsResult;
		if (this.selectedOrganiztion == 0 && this.selectedCampaign == 0 ) {
			this.dataSource = new MatTableDataSource<Subscriptions>(this.filterSubscriptionsResult);
			this.totalPayment= this.filterSubscriptionsResult.reduce((a, b) => +a + +b.amount, 0);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();
		}
		else if (this.selectedOrganiztion != 0 && this.selectedCampaign != 0 ) {
			this.dataSource = new MatTableDataSource<Subscriptions>(this.filterSubscriptionsResult.filter(p =>
				p.user_id == this.selectedOrganiztion && p.campaign_id == this.selectedCampaign ));
				this.totalPayment= this.filterSubscriptionsResult.reduce((a, b) => +a + +b.amount, 0);

		}
		else if (this.selectedOrganiztion != 0 || this.selectedCampaign != 0 ) {

			if (this.selectedOrganiztion != 0) {
				this.filterSubscriptionsResult = this.filterSubscriptionsResult.filter(p => p.user_id == this.selectedOrganiztion);
				

			}

			if (this.selectedCampaign != 0) {
				this.filterSubscriptionsResult = this.filterSubscriptionsResult.filter(p => p.campaign_id == this.selectedCampaign);
				
			} 
			this.dataSource = new MatTableDataSource<Subscriptions>(this.filterSubscriptionsResult);
			this.totalPayment= this.filterSubscriptionsResult.reduce((a, b) => +a + +b.amount, 0);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.cdr.detectChanges();

		}

	
}

}



