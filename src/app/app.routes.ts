import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products-component/products-component';

// Exporter les routes
export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  // autres routes...
];