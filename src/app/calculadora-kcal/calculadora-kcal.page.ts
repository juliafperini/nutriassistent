import { Component } from '@angular/core';
import { ConsultaBancoService } from '../services/consulta-banco.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Alimento, AlimentoRef, Refeicao, Usuario } from '../models/structures';
import { Chart } from 'chart.js';
import { Platform } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-calculadora-kcal',
  templateUrl: './calculadora-kcal.page.html',
  styleUrls: ['./calculadora-kcal.page.scss'],
  standalone: false,
})
export class CalculadoraKcalPage {

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      this.refresh();
      event.target.complete();
    }, 2000);
  }


  chartNutrientes: Chart<'bar', number[], string> | null = null;
  // chartPorAlimento: Chart<'bar', number[], string> | null = null;
  chartDoughnut: Chart<'doughnut', number[], string> | null = null;
  chartCalorias: Chart<'doughnut', number[], string> | null = null;

  proteina: number = 0;
  lipidios: number = 0;
  carbo: number = 0;
  caloria: number = 0;

  usuario: Usuario | null = null;
  codigo: number | null = null;

  listaAlimentos: Alimento[] = [];
  refeicaoCalc: Refeicao = new Refeicao();

  listaGrupos: string[] = [];  

  constructor(
    private route: ActivatedRoute,
    private consultaBancoService: ConsultaBancoService,
    private platform: Platform,
    private router: Router,
    private authService: AuthService,

  ) { 
    this.carregarDadosUsuario();
    this.carregarGrupos();
    this.carregarListaAlimentos();
  }

  async carregarDadosUsuario() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const codUserStr = paramMap.get('codUser');
      this.codigo = codUserStr ? parseInt(codUserStr, 10) : null;
      
      try {
        if (this.codigo) {
          this.usuario = await this.consultaBancoService.obterUsuario(this.codigo);
        } else {
          console.error('Código do usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário ou empregador:', error);
      }
    });
  }

  removerAlimento(j: number): void {
    if (j >= 0 && j < this.refeicaoCalc.alimentosRef.length) {
      const alimentoRemovido = this.refeicaoCalc.alimentosRef[j];

      if (alimentoRemovido && alimentoRemovido.substituto === false) {
          this.refeicaoCalc.caloriaRef -= Math.round(alimentoRemovido.caloriaAlim);
          this.refeicaoCalc.proteinaRef -= Math.round(alimentoRemovido.proteinaAlim);
          this.refeicaoCalc.carboRef -= Math.round(alimentoRemovido.carbAlim);
          this.refeicaoCalc.lipRef -= Math.round(alimentoRemovido.lipAlim);
      }

      this.refeicaoCalc.alimentosRef.splice(j, 1);

      this.renderizarGraficoNutrientes();
      // this.renderizarGraficoPorAlimento();
      this.renderizarGraficoDoughnut();
      this.renderizarGraficoDoughnutCalorias();

    } else {
        console.error('Índice inválido para remover alimento.');
    }
  }

  filtrarAlimentosPorGrupo(alimentos: Alimento[], grupoSelecionado: string): Alimento[] {
    return alimentos.filter(alimento => alimento.grupo === grupoSelecionado);
  }

  adicionarAlimentoRef(j: number, quant: number, alimDesc: string): void {this.refeicaoCalc.caloriaRef += Math.round(this.refeicaoCalc.alimentosRef[j].caloriaAlim);
    const alimentoSelecionado = this.listaAlimentos.find(alimento => alimento.descricao.trim() === alimDesc.trim());
    if (alimentoSelecionado) {
      this.refeicaoCalc.alimentosRef[j] = {
          idAlimRef: j,
          idRefeicao: 0,
          quantAlimento: quant,
          alimentoFonte: 'calc',
          alimentoDesc: alimentoSelecionado.descricao,
          alimentoGrupo: alimentoSelecionado.grupo,
          caloriaAlim: Math.round(((quant*alimentoSelecionado.caloria)/100)* 10)/10,
          proteinaAlim: Math.round(((quant*alimentoSelecionado.proteina)/100)* 10)/10,
          carbAlim: Math.round(((quant*alimentoSelecionado.carbo)/100)* 10)/10,
          lipAlim: Math.round(((quant*alimentoSelecionado.lipidios)/100)* 10)/10,
          substituto: false}
        console.log('this.refeicoes.alimentosRef[',j,']: ', this.refeicaoCalc.alimentosRef[j])
     }

  this.refeicaoCalc.caloriaRef += Math.round(this.refeicaoCalc.alimentosRef[j].caloriaAlim);
  this.refeicaoCalc.proteinaRef += Math.round(this.refeicaoCalc.alimentosRef[j].proteinaAlim);
  this.refeicaoCalc.carboRef += Math.round(this.refeicaoCalc.alimentosRef[j].carbAlim);
  this.refeicaoCalc.lipRef += Math.round(this.refeicaoCalc.alimentosRef[j].lipAlim);

  this.renderizarGraficoNutrientes();
  // this.renderizarGraficoPorAlimento();
  this.renderizarGraficoDoughnut();
  this.renderizarGraficoDoughnutCalorias();
}

  adicionarLinha(): void {
    this.refeicaoCalc.alimentosRef.push(new AlimentoRef());
  }

  carregarListaAlimentos() {
    this.consultaBancoService.obterAlimentos().subscribe((alimentos) => {
      this.listaAlimentos = alimentos;
    });
  }

  carregarGrupos(): void {
    this.consultaBancoService.obterGruposAlimentos().subscribe((alimentos) => {
      this.listaGrupos = alimentos;
    });
  }

  renderizarGraficoNutrientes(): void {
    try {
      const ctx = document.getElementById('chartNutrientes') as HTMLCanvasElement | null;

      this.proteina = this.refeicaoCalc.proteinaRef || 0;
      this.lipidios = this.refeicaoCalc.lipRef || 0;
      this.carbo = this.refeicaoCalc.carboRef || 0;
  
      if (ctx) {
        if (this.chartNutrientes) {
          this.chartNutrientes.destroy();
          
        }
  
        const labels = ['Proteina', 'Carboidrato', 'Lipídios'];
        const valores = [this.proteina, this.carbo, this.lipidios];
  
        this.chartNutrientes = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: '',
              data: valores,
              backgroundColor: [
                'rgba(255, 206, 86, 0.5)',
                '#9d56a4',
                'rgba(75, 192, 192, 0.5)',
              ],
              borderWidth: 0
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Erro ao renderizar gráfico:', error);
    }
  }

  renderizarGraficoDoughnut(): void {
    try {
      const ctx = document.getElementById('chartDoughnut') as HTMLCanvasElement | null;
  
      this.proteina = this.refeicaoCalc.proteinaRef || 0;
      this.lipidios = this.refeicaoCalc.lipRef || 0;
      this.carbo = this.refeicaoCalc.carboRef || 0;
  
      if (ctx) {
        // Verifica se há um gráfico anterior e o destrói
        if (this.chartDoughnut) {
          this.chartDoughnut.destroy();
        }
  
        const labels = ['Proteína', 'Carboidratos', 'Lipídios'];
        const valores = [this.proteina, this.carbo, this.lipidios];
  
        this.chartDoughnut = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Macronutrientes',
                data: valores,
                backgroundColor: [
                  'rgba(255, 206, 86, 0.5)', // Cor para proteína
                  '#9d56a4',               // Cor para carboidratos
                  'rgba(75, 192, 192, 0.5)', // Cor para lipídios
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Erro ao renderizar gráfico doughnut:', error);
    }
  }

  // renderizarGraficoPorAlimento(): void {
  //   try {
  //     const ctx = document.getElementById('chartPorAlimento') as HTMLCanvasElement | null;
  
  //     if (ctx) {
  //       // Verifica se há um gráfico anterior e o destrói
  //       if (this.chartPorAlimento) {
  //         this.chartPorAlimento.destroy();
  //         this.chartPorAlimento = null; // Libera o gráfico atual
  //       }
  
  //       // Labels: nomes dos alimentos adicionados
  //       const labels = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.alimentoDesc);
        
  //       // Dados: macronutrientes e calorias
  //       const proteinas = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.proteinaAlim || 0);
  //       const carboidratos = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.carbAlim || 0);
  //       const lipidios = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.lipAlim || 0);
  //       const calorias = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.caloriaAlim || 0);
  
  //       // Cria um novo gráfico
  //       this.chartPorAlimento = new Chart(ctx, {
  //         type: 'bar',
  //         data: {
  //           labels: labels,
  //           datasets: [
  //             {
  //               label: 'Proteína (g)',
  //               data: proteinas,
  //               backgroundColor: 'rgba(75, 192, 192, 0.5)',
  //               borderWidth: 1,
  //             },
  //             {
  //               label: 'Carboidrato (g)',
  //               data: carboidratos,
  //               backgroundColor: '#9d56a4',
  //               borderWidth: 1,
  //             },
  //             {
  //               label: 'Lipídios (g)',
  //               data: lipidios,
  //               backgroundColor: 'rgba(255, 206, 86, 0.5)',
  //               borderWidth: 1,
  //             },
  //             {
  //               label: 'Calorias (kcal)',
  //               data: calorias,
  //               backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //               borderWidth: 1,
  //             },
  //           ],
  //         },
  //         options: {
  //           responsive: true,
  //           scales: {
  //             x: {
  //               beginAtZero: true,
  //               title: {
  //                 display: true,
  //                 text: 'Alimentos',
  //               },
  //             },
  //             y: {
  //               beginAtZero: true,
  //               title: {
  //                 display: true,
  //                 text: 'Valores',
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Erro ao renderizar gráfico por alimento:', error);
  //   }
  // }

  renderizarGraficoDoughnutCalorias(): void {
    try {
      const ctx = document.getElementById('chartCalorias') as HTMLCanvasElement | null;
  
      if (ctx) {
        if (this.chartCalorias) {
          this.chartCalorias.destroy();
          this.chartCalorias = null; // Libera o gráfico atual
        }
  
        const labels = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.alimentoDesc);
        const calorias = this.refeicaoCalc.alimentosRef.map((alimento) => alimento.caloriaAlim || 0);
  
        // Cria um novo gráfico
        this.chartCalorias = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Calorias por Alimento',
                data: calorias,
                backgroundColor: labels.map(
                  (_, index) =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                      Math.random() * 255
                    )}, ${Math.floor(Math.random() * 255)}, 0.5)` // Gera cores aleatórias
                ),
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Erro ao renderizar gráfico doughnut de calorias:', error);
    }
  }

   refresh(): void {
    this.platform.ready().then(() => {
      window.location.reload();
    });
  }

  async home() {
    try {
      if(this.usuario){
        this.router.navigate(['/dash-usuario', this.usuario.codUser]);
      }else{
        console.log('Nenhum usuário encontrado');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async sair(){
    try {
        await this.authService.logOut().then(() => {
        });
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    }
  }




}
