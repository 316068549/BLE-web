import { RescueOrganizationComponent } from './rescue-organization.component';
import { RescueOrganizationTableComponent } from './rescue-organization-table/rescue-organization-table.component';

export const rescueOrganizationRoutes = [{
	path: '',
	component: RescueOrganizationComponent,
	children: [
    { path: '', component: RescueOrganizationTableComponent }
	]
}];

