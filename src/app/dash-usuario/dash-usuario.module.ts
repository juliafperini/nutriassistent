import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashUsuarioPageRoutingModule } from './dash-usuario-routing.module';

import { DashUsuarioPage } from './dash-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashUsuarioPageRoutingModule
  ],
  declarations: [DashUsuarioPage]
})
export class DashUsuarioPageModule {}
