import { Component, OnInit,ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { select } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatSort ,MatDialog } from '@angular/material';
// Material
// RXJS
import { Subscription } from 'rxjs';
import { CampaignsReported } from '../../../../core/auth/_models/campaigns-reported.model';
import { reportedCampaigns } from '../../../../core/auth/_services/reportedCampaigns.service';
import {AlertComponentComponent} from '../../alert-component/alert-component.component';
import { LayoutUtilsService } from '../../../../core/_base/crud';
import { campaignsService } from '../../../../core/auth/_services/campaigns.service';
import { memberService } from '../../../../core/auth/_services/members.service';
import { Campaigns } from '../../../../core/auth/_models/Campaigns.model';
import { Members } from '../../../../core/auth/_models/member.model';

@Component({
  selector: 'kt-campaign-reported',
  templateUrl: './campaign-reported.component.html',
  styleUrls: ['./campaign-reported.component.scss']
})
export class CampaignReportedComponent implements OnInit, OnDestroy {
	dataSource: MatTableDataSource<any>;
	displayedColumns = [ 'id', 'user_id','campaign_id','created_at','Actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Selection
	selection = new SelectionModel<CampaignsReported>(true, []);
	ReportResult: CampaignsReported[];
	selectedProvider;
	selectedUser='0';
	selectedCampaign='0';
	selectDate;
	CampaignsResult: Campaigns[];
	filteredCampaignsResult: Campaigns[];
	membersList: Members[];

	// Subscriptions
	private subscriptions: Subscription[] = [];
	layoutUtilsService: any;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private reportedCampaigns: reportedCampaigns,
		public dialog: MatDialog,
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
		let donations = this.reportedCampaigns.getcampaignsInformation().subscribe(res => {
			if (res.success == true) {
				this.ReportResult = res.data;
				
				this.dataSource = new MatTableDataSource<CampaignsReported>(this.ReportResult);
				console.log(this.ReportResult)
				console.log(this.dataSource)
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;

				this.cdr.detectChanges();
			}
		})
		this.subscriptions.push(donations)
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.ReportResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.ReportResult.length) {
			this.selection.clear();
		} else {
			this.ReportResult.forEach(row => this.selection.select(row));
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

	getOrgName(id){
		if(this.membersList){
			let organization=this.membersList.find(p=>p.id===id)
			return organization.name
		}
	}

	getCampaignName(id){
		if(this.CampaignsResult&&this.ReportResult&&id){
			let campaign=this.CampaignsResult.find(p=>p.id===id)
			return campaign.title
		}
	}



	deleteCampaign(id){
		const dialogRef = this.dialog.open(AlertComponentComponent, {
			width: '40%',
			data: { 'title': 'Delete Campagin', 'message': 'Are You sure you want to delete this Campagin?' },
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} else {
			let deleteCampagin=this.reportedCampaigns.deleteCampaigns(id).subscribe(res=>{
					if(res.success== true){
						this.layoutUtilsService.showActionNotification('deleted succefully')
						this.loadDonationList();
						this.cdr.detectChanges()
					}
				})
				this.subscriptions.push(deleteCampagin)
			}
		});


	}


}


