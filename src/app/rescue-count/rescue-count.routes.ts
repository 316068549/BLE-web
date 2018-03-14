import { RescueCountComponent } from './rescue-count.component';
import { RescueCountTableComponent } from './rescue-count-table/rescue-count-table.component';
import { RescueDetailComponent } from './rescue-detail/rescue-detail.component';
import { RescueDetailComponent2 } from './rescue-detail2/rescue-detail2.component';

export const RescueCountRoutes = [{
	path: '',
	component: RescueCountComponent,
	children: [

    { path: '', component: RescueCountTableComponent },
    { path: 'detail/:rescueCenterId', component: RescueDetailComponent,children:[
      // { path: 'detail/:rescueCenterId', component: RescueDetailComponent2 }
    ]
    },
    { path: 'details/:rescueCenterId', component: RescueDetailComponent2}

	]
}];

