import { Routes } from '@angular/router';
import { PersonComponent } from './pages/person/person.component';
import { ItemComponent } from './pages/item/item.component';
import { OrderComponent } from './pages/order/order.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'persons', component: PersonComponent },
    { path: 'items', component: ItemComponent },
    { path: 'orders', component: OrderComponent },
];
