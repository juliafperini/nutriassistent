import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinhaEvolucaoPageRoutingModule } from './minha-evolucao-routing.module';

import { MinhaEvolucaoPage } from './minha-evolucao.page';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinhaEvolucaoPageRoutingModule,
    NgChartsModule,
  ],
  declarations: [MinhaEvolucaoPage]
})
export class MinhaEvolucaoPageModule {}
