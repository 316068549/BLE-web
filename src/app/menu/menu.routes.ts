import { MenuComponent } from './menu.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuTableComponent } from './menu-table/menu-table.component';

export const menuRoutes = [{
	path: '',
	component: MenuComponent,
	children: [

    { path: '', component: MenuTableComponent },
    { path: '/:permissionId', component: MenuTableComponent },
    // { path: 'detail/:menuId', component: MenuDetailComponent }

	]
}];

