import { TrackComponent } from './track.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { TrackTableComponent } from './track-table/track-table.component';

export const trackRoutes = [{
	path: '',
	component: TrackComponent,
	children: [

    { path: '', component: TrackTableComponent },
    { path: 'detail/:deviceIMEI', component: TrackDetailComponent }

	]
}];

