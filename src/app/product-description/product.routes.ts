import { ProductComponent } from './product.component';
import { ProductTableComponent } from './product-table/product-table.component';

export const productRoutes = [{
	path: '',
	component: ProductComponent,
	children: [
    { path: '', component: ProductTableComponent }
	]
}];

