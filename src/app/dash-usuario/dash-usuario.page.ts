import { Component } from '@angular/core';
import { Usuario } from '../models/structures';
import { ActivatedRoute } from '@angular/router';
import { ConsultaBancoService } from '../services/consulta-banco.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dash-usuario',
  templateUrl: './dash-usuario.page.html',
  styleUrls: ['./dash-usuario.page.scss'],
  standalone: false,
})
export class DashUsuarioPage {

  usuario: Usuario | null = null;
  codigo: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private consultaBancoService: ConsultaBancoService,
    private authService: AuthService,
  ) { 
    this.carregarDadosUsuario();
  }

  async carregarDadosUsuario() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const codUserStr = paramMap.get('codUser');
      // Verifica se o codUserStr não é nulo e faz a conversão para número
      this.codigo = codUserStr ? parseInt(codUserStr, 10) : null;
      
      try {
        // Verifica se o código do usuário foi encontrado
        if (this.codigo) {
          // Carrega os dados do usuário e do empregador de forma assíncrona
          this.usuario = await this.consultaBancoService.obterUsuario(this.codigo);
        } else {
          console.error('Código do usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário ou empregador:', error);
      }
    });
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
