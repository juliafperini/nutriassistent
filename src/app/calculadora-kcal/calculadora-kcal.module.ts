import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculadoraKcalPageRoutingModule } from './calculadora-kcal-routing.module';

import { CalculadoraKcalPage } from './calculadora-kcal.page';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculadoraKcalPageRoutingModule,
    NgChartsModule,
  ],
  declarations: [CalculadoraKcalPage]
})
export class CalculadoraKcalPageModule {}
