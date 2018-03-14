import { ElectricityComponent } from './electricity.component';
import { ElectricityTableComponent } from './electricity-table/electricity-table.component';
import { ElectricityDetailComponent } from './electricity-detail/electricity-detail.component';

export const electricityRoutes = [{
	path: '',
	component: ElectricityComponent,
	children: [

    { path: '', component: ElectricityTableComponent },
    { path: 'detail/:deviceIMEI', component: ElectricityDetailComponent }

	]
}];

