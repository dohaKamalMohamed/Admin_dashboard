// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
	{path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'campaigns',
				loadChildren: () => import('./views/pages/campaigns/campaigns.module').then(m => m.CampaignsModule)
			},
			{
				path: 'campaignsReported',
				loadChildren: () => import('./views/pages/campaigns-reported/campaigns-reported.module').then(m => m.CampaignsReportedModule)
			},
            {
				path: 'categories',
				loadChildren: () => import('./views/pages/categories/categories.module').then(m => m.CategoriesModule)
			},
            {
				path: 'donations',
				loadChildren: () => import('./views/pages/donations/donations.module').then(m => m.DonationsModule)
			},
			{
				path: 'setting',
				loadChildren: () => import('./views/pages/general-setting/general-setting.module').then(m => m.GeneralSettingModule)
			},
			{
				path: 'members',
				loadChildren: () => import('./views/pages/members/members.module').then(m => m.MembersModule)
			},
			{
				path: 'pages',
				loadChildren: () => import('./views/pages/pages/pages.module').then(m => m.PagesModule)
			},
			{
				path: 'paymentSetting',
				loadChildren: () => import('./views/pages/payment-setting/payment-setting.module').then(m => m.PaymentSettingModule)
			},
			{
				path: 'socialProfiles',
				loadChildren: () => import('./views/pages/progiles-social/progiles-social.module').then(m => m.ProgilesSocialModule)
			},
			{
				path: 'subscriptions',
				loadChildren: () => import('./views/pages/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule)
			},

			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
