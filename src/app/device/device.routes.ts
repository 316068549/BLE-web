import { DeviceComponent } from './device.component';
import { DeviceTableComponent } from './device-table/device-table.component';

export const deviceRoutes = [{
	path: '',
	component: DeviceComponent,
	children: [

    { path: '', component: DeviceTableComponent },
    // { path: 'detail/:id', component: MenuDetailComponent }

	]
}];

