// Angular
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { dashboardService } from '../../../core/auth/_services/dashboard.service';
import { Subscription } from 'rxjs';
import {memberService} from '../../../core/auth/_services/members.service';


@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

	//Number Of Donors in html
	NumberOfDonors = 0
	//total FundsRaised
	FundsRaised = 0
	//Number Of Campaigns
	Campaigns = 0
	//Number Of Campaigns
	Members = 0
	// total of subscription
	Subscription = 0
	recent_campaigns:[];
	recent_members:[];


	private subscriptions: Subscription[] = [];
	
	constructor(private dashboardService: dashboardService, private cgr:ChangeDetectorRef) {
	}

	ngOnInit(): void {
		const dashboardInformation = this.dashboardService.getDashboardInformation().subscribe(res => {
			if (res.success == true) {
				this.Campaigns = res.data.campaigns;
				this.FundsRaised = res.data.funds_raised;
				this.Members = res.data.members;
				this.NumberOfDonors = res.data.donations;
				this.Subscription = res.data.subscriptions;
				this.recent_campaigns=res.data.recent_campaigns;
				this.recent_members=res.data.recent_members
				this.cgr.detectChanges()
			}
		})
		this.subscriptions.push(dashboardInformation);
	}
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
}
