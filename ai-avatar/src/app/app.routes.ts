import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { ControllerComponent } from './controller/controller.component';

export const routes: Routes = [
    { path: 'viewer', component: ViewerComponent },
    { path: 'controller', component: ControllerComponent },
    { path: '', redirectTo: '/viewer', pathMatch: 'full' },
    { path: '**', redirectTo: '/viewer' }
];
