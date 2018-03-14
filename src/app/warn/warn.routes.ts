import { WarnComponent } from './warn.component';
import { WarnTableComponent } from './warn-table/warn-table.component';
import { WarnDetailComponent } from './warn-detail/warn-detail.component';

export const warnRoutes = [{
	path: '',
	component: WarnComponent,
	children: [

    { path: '', component: WarnTableComponent },
    { path: 'detail/:deviceIMEI/:alarmId', component: WarnDetailComponent }

	]
}];

