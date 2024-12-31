import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashAdmPageRoutingModule } from './dash-adm-routing.module';

import { DashAdmPage } from './dash-adm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashAdmPageRoutingModule
  ],
  declarations: [DashAdmPage]
})
export class DashAdmPageModule {}
