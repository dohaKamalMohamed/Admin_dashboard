// Angular
import { Component, Input, OnInit } from '@angular/core';

export interface Timeline2Data {
	image: string;
	text: string;
	icon?: string;
}

@Component({
	selector: 'kt-timeline2',
	templateUrl: './timeline2.component.html',
	styleUrls: ['./timeline2.component.scss']
})
export class Timeline2Component implements OnInit {
	// Public properties
	@Input() data: Timeline2Data[];

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (!this.data) {
			this.data = [
				{
					image: '10:00',
					icon: 'fa fa-genderless kt-font-danger',
					text: 'Lorem ipsum dolor sit amit,consectetur eiusmdd tempor\n' +
						'incididunt ut labore et dolore magna',
				},

				{
					image: '14:00',
					icon: 'fa fa-genderless kt-font-brand',
					text: 'Make Deposit <a href="$event.preventDefault();" class="kt-link kt-link--brand kt-font-bolder">USD 700</a> To ESL.',
				},
				{
					image: '17:00',
					icon: 'fa fa-genderless kt-font-info',
					text: 'Placed a new order in <a href="$event.preventDefault();" class="kt-link kt-link--brand kt-font-bolder">SIGNATURE MOBILE</a> marketplace.',
				},
				{
					image: '16:00',
					icon: 'fa fa-genderless kt-font-brand',
					text: 'Lorem ipsum dolor sit amit,consectetur eiusmdd tempor<br>' +
						'incididunt ut labore et dolore magna elit enim at minim<br>' +
						'veniam quis nostrud',
				},
				{
					image: '17:00',
					icon: 'fa fa-genderless kt-font-danger',
					text: 'Received a new feedback on <a href="$event.preventDefault();" class="kt-link kt-link--brand kt-font-bolder">FinancePro App</a> product.',
				},
			];
		}
	}
}
