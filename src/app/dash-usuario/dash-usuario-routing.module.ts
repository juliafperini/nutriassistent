import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashUsuarioPage } from './dash-usuario.page';

const routes: Routes = [
  {
    path: ':codUser',
    component: DashUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashUsuarioPageRoutingModule {}
