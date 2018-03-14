import { RescuepapersComponent } from './rescuepapers.component';
import { RescuepapersTableComponent } from './rescuepapers-table/rescuepapers-table.component';
import { RescueDetailComponent } from './rescue-detail/rescue-detail.component';

export const rescuePaperRoutes = [{
	path: '',
	component: RescuepapersComponent,
	children: [

    { path: '', component: RescuepapersTableComponent },
    { path: 'detail/:id', component: RescueDetailComponent }

	]
}];

