import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashAdmPage } from './dash-adm.page';

const routes: Routes = [
  {
    path: ':codUser',
    component: DashAdmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashAdmPageRoutingModule {}
