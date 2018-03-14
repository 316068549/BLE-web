import { HelperComponent } from './helpers.component';
import { HelpersTableComponent } from './helpers-table/helpers-table.component';

export const helperRoutes = [{
	path: '',
	component: HelperComponent,
	children: [

    { path: '', component: HelpersTableComponent },
    // { path: 'detail/:id', component: MenuDetailComponent }

	]
}];

