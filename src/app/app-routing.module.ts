import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentsListComponent } from './components/incidents-list/incidents-list.component';
import { IncidentDetailsComponent } from './components/incident-details/incident-details.component';

const routes: Routes =
[
  {
    path: '', // default
    redirectTo: 'incidents',
    pathMatch: 'full'
  },
  {
    path: 'incidents',
    component: IncidentsListComponent
  },
  {
    path: 'incident/:id',
    component: IncidentDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
