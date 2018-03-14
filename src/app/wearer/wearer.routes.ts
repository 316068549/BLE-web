import { WearerComponent } from './wearer.component';
import { WearerTableComponent } from './wearer-table/wearer-table.component';

export const wearerRoutes = [{
	path: '',
	component: WearerComponent,
	children: [

    { path: '', component: WearerTableComponent },
    // { path: 'detail/:id', component: MenuDetailComponent }

	]
}];

