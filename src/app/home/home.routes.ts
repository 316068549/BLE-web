import { HomeComponent } from './home.component';
import { MonitorComponent } from '../monitor/monitor.component';
import { VideoComponent } from '../monitor/video/video.component';
import { ElectricityComponent } from '../electricity/electricity.component';
import { StatusComponent } from '../status/status.component';
import { MonitorCenterComponent } from '../monitor-center/monitor-center.component';

export const workspaceRoutes = [
	{
		path: '',
		component: HomeComponent,
		children: [
			{ path: '', redirectTo: 'monitor', pathMatch: 'full' },
      { path: ' ', redirectTo: 'monitorCenter', pathMatch: 'full' },
      {
        path: 'menu/:permissionId',
        loadChildren: '../menu/menu.module#MenuModule'
      },
      // {
      //   path: 'electricity',
      //   loadChildren: '../electricity/electricity.module#ElectricityModule'
      // },
      {
        path: 'track/:permissionId',
        loadChildren: '../track/track.module#TrackModule'
      },
      {
        path: 'online/:permissionId',
        loadChildren: '../status/status.module#StatusModule'
      },

      // {
      //   path: 'status/:permissionId',
      //   loadChildren: '../status/status.module#StatusModule'
      // },
      {
        path: 'organization/:permissionId',
        loadChildren: '../rescue-organization/rescue-organization.module#RescueOrganizationModule'
      },
      {
        path: 'description/:permissionId',
        loadChildren: '../description/desc.module#DescModule'
      },
      {
        path: 'product/:permissionId',
        loadChildren: '../product-description/product.module#ProductModule'
      },
      {
        path: 'services/:permissionId',
        loadChildren: '../services/serv.module#ServModule'
      },
      {
        path: 'helpers/:permissionId',
        loadChildren: '../helpers/helpers.module#HelpersModule'
      },
      {
        path: 'wearer/:permissionId',
        loadChildren: '../wearer/wearer.module#WearerModule'
      },
      {
        path: 'device/:permissionId',
        loadChildren: '../device/device.module#DeviceModule'
      },
      {
        path: 'rescuecount/:permissionId',
        loadChildren: '../rescue-count/rescue-count.module#RescueCountModule'
      },
      {
        path: 'rescuepapers/:permissionId',
        loadChildren: '../rescuepapers/rescuepapers.module#RescuepapersModule'
      },
      {
        path: 'users/:permissionId',
        loadChildren: '../users/users.module#UsersModule'
      },
      {
        path: 'permission/:permissionId',
        loadChildren: '../permissions/permissions.module#PermissionModule'
      },
      {
        path: 'pay/:payId',
        loadChildren: '../pay/pay.module#PayModule'
      },
      {
        path: 'payrecords/:payrecordsId',
        loadChildren: '../pay-records/pay-records.module#PayRecordsModule'
      },
      {
        path: 'monitor',
        component: MonitorComponent
      },
      {
        path: 'monitorCenter',
        component: MonitorCenterComponent
      },
      {
        path: 'video',
        component: VideoComponent
      }

		]
	}
];
