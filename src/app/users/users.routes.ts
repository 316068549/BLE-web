import { UserComponent } from './users.component';
import { UsersTableComponent } from './users-table/users-table.component';

export const userRoutes = [{
	path: '',
	component: UserComponent,
	children: [

    { path: '', component: UsersTableComponent },
    // { path: 'detail/:id', component: MenuDetailComponent }

	]
}];

