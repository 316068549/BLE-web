import { PayRecordsComponent } from './pay-records.component';
import { PayRecordsTableComponent } from './pay-records-table/pay-records-table.component';

export const payRecordsRoutes = [{
	path: '',
	component: PayRecordsComponent,
	children: [
    { path: '', component: PayRecordsTableComponent }
	]
}];

