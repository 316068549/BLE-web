import { DescComponent } from './desc.component';
import { DescTableComponent } from './desc-table/desc-table.component';

export const descRoutes = [{
	path: '',
	component: DescComponent,
	children: [
    { path: '', component: DescTableComponent }
	]
}];

