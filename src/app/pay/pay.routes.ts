import { PayComponent } from './pay.component';
import { PayStateTableComponent } from './pay-state/paystate-table.component';

export const payRoutes = [{
	path: '',
	component: PayComponent,
	children: [
    { path: '', component: PayStateTableComponent }
	]
}];

