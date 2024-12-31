import { Component } from '@angular/core';
import { Usuario } from '../models/structures';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CadastroService } from '../services/cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: false,
})
export class CadastroPage {

  mostrarBarraProgresso: boolean = false;
  public progress = 0;

  usuario = new Usuario ();

  senha: string = '';
  repetirSenha: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private cadastroService: CadastroService,
  ) { }

  async adicionarUsuario(): Promise<void> {
    try {
      if (this.usuario.email === '' || 
        this.usuario.nome === ''
        ) {
          this.alerta('Preencha todos os campos');
      } if(this.senha !== this.repetirSenha){
          this.alerta('Senhas não conferem');
      }else {
        this.mostrarBarraProgresso = true;
        this.progress = 0;
        await this.cadastroService.novoUsuario(this.usuario, (percentage) => {
        this.progress = percentage;
        });
        this.authService.registrarLogin(this.usuario.email, this.senha);
        this.alerta('Usuário cadastrado com sucesso');

        if(this.usuario.tipoPessoa === 'usuario'){
          this.router.navigate(['/dash-usuario', this.usuario.codUser]);
        }
        if(this.usuario.tipoPessoa === 'administrador'){
          this.router.navigate(['/dash-adm', this.usuario.codUser]);
        }
     }
    } catch (error) {
      console.error('Erro ao adicionar usuario:', error);
    }
    this.progress = 0;
    this.mostrarBarraProgresso = false;
  }

  // Função para exibir alerta
  async alerta(message: string) {
    const alerta = await this.alertController.create({
      message,
      header: '',
      buttons: ['OK']
    });
    await alerta.present();
  }

}
