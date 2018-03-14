import { StatusComponent } from './status.component';
import { StatusTableComponent } from './status-table/status-table.component';

export const statusRoutes = [{
	path: '',
	component: StatusComponent,
	children: [

    { path: '', component: StatusTableComponent }

	]
}];

