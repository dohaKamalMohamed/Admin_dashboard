import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
// RXJS
import { Subscription } from 'rxjs';
import { Donations } from '../../../../core/auth/_models/Donations.model';
import { donationsService } from '../../../../core/auth/_services/donation.service'
import { campaignsService } from '../../../../core/auth/_services/campaigns.service';
import { memberService } from '../../../../core/auth/_services/members.service';
import { DonationDetailsComponent } from '../donation-details/donation-details.component';
import { Campaigns } from '../../../../core/auth/_models/Campaigns.model';
import { Members } from '../../../../core/auth/_models/member.model';

@Component({
	selector: 'kt-donations-list',
	templateUrl: './donations-list.component.html',
	styleUrls: ['./donations-list.component.scss']
})
export class DonationsListComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['ID', 'FullName','Organization', 'Campaigns', 'Donation', 'Date', 'Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<Donations>(true, []);
	DonationsResult: Donations[];
	DonationFilterResult: Donations[];
	CampaignsResult: Campaigns[];
	filteredCampaignsResult: Campaigns[];
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
		public dialog: MatDialog,
		private donationsService: donationsService,
		private campaignsService: campaignsService,
		private memberService: memberService
	) { }
	ngOnInit() {
		this.loadDonationList();
		this.loadOrganizationList()
		this.loadCampaignList();
		// Set title to page breadCrumbs
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	loadDonationList() {
		let donations = this.donationsService.getAllDonations().subscribe(res => {
			if (res.success == true) {
				this.DonationsResult = res.data.data;
				this.totalPayment= this.DonationsResult.reduce((a, b) => +a + +b.donation, 0);
				this.dataSource = new MatTableDataSource<Donations>(this.DonationsResult);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;

				this.cdr.detectChanges();
			}
		})
		this.subscriptions.push(donations)
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.DonationsResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.DonationsResult.length) {
			this.selection.clear();
		} else {
			this.DonationsResult.forEach(row => this.selection.select(row));
		}
	}
	/* UI */
	/**
	 * Returns Student roles string
	 *
	 * @param id
	 */
	editDonation(id) {
		this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
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
	viewDonation(Donations) {
		const dialogRef = this.dialog.open(DonationDetailsComponent, {
			width: '30%',
			data: { Donations },
		});
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
		
			this.DonationFilterResult = this.DonationsResult;
			if (this.selectedOrganiztion == 0 && this.selectedCampaign == 0 ) {
				this.dataSource = new MatTableDataSource<Donations>(this.DonationFilterResult);
				this.totalPayment= this.DonationFilterResult.reduce((a, b) => +a + +b.donation, 0);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
			}
			else if (this.selectedOrganiztion != 0 && this.selectedCampaign != 0 ) {
				this.dataSource = new MatTableDataSource<Donations>(this.DonationFilterResult.filter(p =>
					p.user_id == this.selectedOrganiztion && p.campaign_id == this.selectedCampaign ));
					this.totalPayment= this.DonationFilterResult.reduce((a, b) => +a + +b.donation, 0);
	
			}
			else if (this.selectedOrganiztion != 0 || this.selectedCampaign != 0 ) {
	
				if (this.selectedOrganiztion != 0) {
					this.DonationFilterResult = this.DonationFilterResult.filter(p => p.user_id == this.selectedOrganiztion);
					
	
				}
	
				if (this.selectedCampaign != 0) {
					this.DonationFilterResult = this.DonationFilterResult.filter(p => p.campaign_id == this.selectedCampaign);
					
				} 
				this.dataSource = new MatTableDataSource<Donations>(this.DonationFilterResult);
				this.totalPayment= this.DonationFilterResult.reduce((a, b) => +a + +b.donation, 0);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.cdr.detectChanges();
	
			}
	
		
	}


}


