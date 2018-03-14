import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const appRoutes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'home',
		loadChildren: './home/home.module#WorkspaceModule'
	}
	// ,
	// {
	// 	path: '**', // fallback router must in the last
	// 	component: LoginComponent
	// }
];
