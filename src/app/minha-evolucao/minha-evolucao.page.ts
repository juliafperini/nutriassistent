import { Component, OnInit } from '@angular/core';
import { Evolucao, Usuario } from '../models/structures';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaBancoService } from '../services/consulta-banco.service';
import { AlertController, Platform } from '@ionic/angular';
import { EvolucaoService } from '../services/evolucao.service';
import { Chart, ChartConfiguration, registerables, TooltipItem } from 'chart.js';
import { AuthService } from '../services/auth.service';
Chart.register(...registerables);

@Component({
  selector: 'app-minha-evolucao',
  templateUrl: './minha-evolucao.page.html',
  styleUrls: ['./minha-evolucao.page.scss'],
  standalone: false,
})
export class MinhaEvolucaoPage {

  chart: Chart | null = null;

  mostrarBarraProgresso: boolean = false;
  public progress = 0;

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      this.refresh();
      event.target.complete();
    }, 2000);
  }

  usuario: Usuario | null = null;
  evolucao: Evolucao = new Evolucao();
  codigo: number | null = null;
  codigoUser: number = -1;

  evolucoes: Evolucao[] = [];
  tabelaEvolucoes: any[] = [];

  valorInvalido: boolean = false;

  possuiDados: boolean = false;

  medidasSelecionadas: (keyof Evolucao)[] = [];

  medidasDisponiveis = [
    { nome: 'Peso', chave: 'peso', selecionada: true },
    { nome: 'Cintura', chave: 'cintura', selecionada: true },
    { nome: 'Abdômen', chave: 'abdomen', selecionada: true},
    { nome: 'Quadril', chave: 'quadril', selecionada: true },
    { nome: 'Coxa', chave: 'coxa', selecionada: true },
    { nome: 'Braço', chave: 'braco', selecionada: true },
  ];

  constructor(
    private route: ActivatedRoute,
    private consultaBancoService: ConsultaBancoService,
    private evolucaoService: EvolucaoService,
    private platform: Platform,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {
    this.carregarDadosUsuario();
   }

  async carregarDadosUsuario() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const codUserStr = paramMap.get('codUser');
      this.codigo = codUserStr ? parseInt(codUserStr, 10) : null;
      
      try {

        if (this.codigo) {

          this.usuario = await this.consultaBancoService.obterUsuario(this.codigo);
          if (this.usuario?.evolucao?.length) {
            const medidasSelecionadas = this.medidasDisponiveis.filter(medida => medida.selecionada).map(medida => medida.chave as keyof Evolucao);
            this.criarGraficoEvolucao(this.usuario.evolucao, medidasSelecionadas);
            this.carregarEvolucoes();
          }
        } else {
          console.error('Código do usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário ou empregador:', error);
      }
    });
  }

  async atualizarMedidas(): Promise<void> {
    try {
      if (this.evolucao.peso === null || 
        this.evolucao.quadril === null ||
        this.evolucao.cintura === null ||
        this.evolucao.abdomen === null
        ) {
          const alert = await this.alertController.create({
            header: '',
            message: 'Preencha todos os campos',
            buttons: ['OK']
          });
          await alert.present();
      } else {
        this.mostrarBarraProgresso = true;
        this.progress = 0;
          if(this.usuario){
            await this.evolucaoService.atualizarEvolucao(this.evolucao, this.usuario, (percentage) => {
            this.progress = percentage;
            }); 
          }
        const alert = await this.alertController.create({
          header: 'Medidas enviadas com sucesso!',
          message: 'Até mais :)',
          buttons: ['OK']
        });
        await alert.present();
        this.refresh();
      }
    } catch (error) {
      console.error('Erro ao adicionar medidas:', error);
      this.refresh();
    }
    this.progress = 0;
    this.mostrarBarraProgresso = false;
  }

  criarGraficoEvolucao(evolucoes: Evolucao[], medidasSelecionadas: (keyof Evolucao)[]) {
    const ultimasEvolucoes = evolucoes.slice(-6); // Pega as últimas 6 evoluções
    const labels = ultimasEvolucoes.map(evolucao => evolucao.dataf); // Extrai as datas para o eixo X
  
    const cores: Record<keyof Evolucao, string> = {
      peso: '#f8a7c2',
      cintura: '#a7caf8',
      abdomen: '#a7f8ed',
      quadril: '#dbbdf8',
      coxa: '#f8eca7',
      braco: '#c7c7c7',
      codUser: '',
      codEv: '',
      dataf: '',
      data: '',
    };
  
    const coresBackground: Record<keyof Evolucao, string> = {
      peso: 'rgba(255, 99, 132, 0.2)',
      cintura: 'rgba(54, 162, 235, 0.2)',
      abdomen: 'rgba(75, 192, 192, 0.2)',
      quadril: 'rgba(153, 102, 255, 0.2)',
      coxa: 'rgba(255, 206, 86, 0.2)',
      braco: '#dadada',
      codUser: '',
      codEv: '',
      dataf: '',
      data: '',
    };

    const datasets = medidasSelecionadas.map(medida => ({
      label: String(medida).charAt(0).toUpperCase() + String(medida).slice(1),
      data: ultimasEvolucoes.map(evolucao => evolucao[medida] as number | null),
      borderColor: cores[medida],
      backgroundColor: coresBackground[medida],
      fill: false,
      lineTension: 0.1,
      spanGaps: true,
    }));
  
    const config: ChartConfiguration<'line', (number | null)[], string> = {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            type: 'category', 
            title: {
              display: true,
              text: 'ùltimas 6 medidas',
            },
            ticks: {
              autoSkip: false, 
              maxRotation: 0, 
              minRotation: 0,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Medidas (cm/kg)',
            },
            beginAtZero: false, 
          },
        },
      },
    };
    if (this.chart) {
      this.chart.destroy();
    }
  
    const ctx = document.getElementById('chartEvolucao') as HTMLCanvasElement;
    this.chart = new Chart(ctx, config);
  }

  atualizarGrafico() {
    this.medidasSelecionadas = this.medidasDisponiveis
      .filter(medida => medida.selecionada)
      .map(medida => medida.chave);

    this.criarGraficoEvolucao(this.usuario?.evolucao || [], this.medidasSelecionadas);
  }

  async carregarEvolucoes() {
    try {
        // Obtemos as últimas evoluções
        if(this.codigo){
        const snapshot = await this.evolucaoService.obterUltimasEvolucoes(this.codigo);
        
        this.evolucoes = snapshot;
        this.criarTabelaEvolucoes(this.evolucoes); // Criar a tabela
        }
      } catch (error) {
        console.error('Erro ao carregar evoluções:', error);
    }
  }
  
  criarTabelaEvolucoes(evolucoes: Evolucao[]) {
    const ultimasEvolucoes = evolucoes.slice(-10).sort((a, b) => new Date(b.dataf).getTime() - new Date(a.dataf).getTime());

    // Formatar dados para tabela
    this.tabelaEvolucoes = ultimasEvolucoes.map(evolucao => ({
      data: evolucao.dataf,
      peso: evolucao.peso,
      abdomen: evolucao.abdomen,
      quadril: evolucao.quadril,
      coxa: evolucao.coxa,
      braco: evolucao.braco
    }));
  }

  refresh(): void {
    this.platform.ready().then(() => {
      window.location.reload();
    });
  }

  validarFormato(event: any) {
    const valorForm = /^\d+(\.\d{2})?$/;
    const valorValido = valorForm.test(event.detail.value);
  
    this.valorInvalido = !valorValido;
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
        console.log('Logout executado');
        });
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    }
  }


}
