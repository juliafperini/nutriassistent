import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinhaEvolucaoPage } from './minha-evolucao.page';

const routes: Routes = [
  {
    path: ':codUser',
    component: MinhaEvolucaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinhaEvolucaoPageRoutingModule {}
