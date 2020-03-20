export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboards',
					root: true,
					alignment: 'left',
					page: '/dashboard',
				},


			]
		},
		aside: {
			self: {},
			items: [
				{
					title: 'General Setting',
					root: true,
					icon: 'flaticon-user-settings',
					bullet: 'dot',
					submenu: [
						{
							title:'General',
							page:'/setting/general'
						},
						{
							title:'Limits',
							page:'/setting/limits'
						},
					]
				},

				{
					title: 'Payment Setting',
					root: true,
					icon: 'flaticon-cogwheel',
					page: '/paymentSetting',
					bullet: 'dot',
				},
				{
					title: 'Social Profiles',
					root: true,
					icon: 'flaticon2-website',
					page: '/socialProfiles',
					bullet: 'dot',
				},

				{
					title: 'Campaigns',
					root: true,
					icon: 'flaticon2-analytics-2',
					page: '/campaigns',
					bullet: 'dot',
				},

				{
					title: 'Reported Campaigns',
					root: true,
					icon: 'flaticon2-delete',
					page: '/campaignsReported',
					bullet: 'dot',
				},
				{
					title: 'Categories',
					root: true,
					icon: 'flaticon2-layers-1',
					page: '/categories',
					bullet: 'dot',
				},
				{
					title: 'Donations',
					root: true,
					icon: 'flaticon-coins',
					page: '/donations',
				},
				{
					title: 'Subscriptions',
					root: true,
					icon: 'flaticon2-list',
					page: '/subscriptions',

				},

				{
					title: 'Members',
					root: true,
					icon: 'flaticon2-avatar',
					page: '/members',

				},
				{
					title: 'Pages',
					root: true,
					icon: 'flaticon-web',
					page: '/pages',

				},

			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
