import { PermissionComponent } from './permissions.component';
import { PermissionTableComponent } from './permissions-table/permissions-table.component';

export const permissionRoutes = [{
	path: '',
	component: PermissionComponent,
	children: [

    { path: '', component: PermissionTableComponent },
    // { path: 'detail/:id', component: MenuDetailComponent }

	]
}];

