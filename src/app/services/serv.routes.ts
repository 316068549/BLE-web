import { ServComponent } from './serv.component';
import { ServTableComponent } from './serv-table/serv-table.component';

export const servRoutes = [{
	path: '',
	component: ServComponent,
	children: [
    { path: '', component: ServTableComponent }
	]
}];

