import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  {
    path: 'dash-usuario',
    loadChildren: () => import('./dash-usuario/dash-usuario.module').then( m => m.DashUsuarioPageModule)
  },
  {
    path: 'dash-adm',
    loadChildren: () => import('./dash-adm/dash-adm.module').then( m => m.DashAdmPageModule)
  },
  {
    path: 'calculadora-kcal',
    loadChildren: () => import('./calculadora-kcal/calculadora-kcal.module').then( m => m.CalculadoraKcalPageModule)
  },
  {
    path: 'minha-evolucao',
    loadChildren: () => import('./minha-evolucao/minha-evolucao.module').then( m => m.MinhaEvolucaoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
