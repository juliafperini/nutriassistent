import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ConsultaBancoService } from './consulta-banco.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CadastroService } from './cadastro.service';

import { GoogleAuthProvider } from '@angular/fire/auth';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  mostrarBarraProgresso: boolean = false;
  public progress = 0;

  nome: string = '';
  email: string = '';

  constructor(
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private router: Router,
    private consultaBancoService: ConsultaBancoService,
    private cadastroService: CadastroService

  ) { }

  async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  async registrarLogin(email: string, senha: string) {
    return this.auth.createUserWithEmailAndPassword(email, senha);
  }

  async login(email: string, senha: string) {
    try {
      await this.auth.signInWithEmailAndPassword(email, senha);

      const tipoPessoa = await this.consultaBancoService.pesquisarTipoPessoa(email);
      const codUser = await this.consultaBancoService.pesquisarCodUsuario(email);
  
      if (email === 'juliafperini@gmail.com') {
        this.router.navigate([`/dash-adm`]);
      } else if (tipoPessoa === 'usuario') {          
        this.router.navigate(['/dash-usuario', codUser]);
      } else {
        this.exibirAlerta('Nenhum usuário encontrado');
      }
    } catch (e) {
      console.error(e);
      const alert = await this.alertController.create({
        header: 'Usuário não encontrado',
        message: 'Realize seu cadastro',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await this.auth.signInWithPopup(provider);

      if (result.user && result.user.email) {
        this.email = result.user.email;
        this.nome = this.email.split('@')[0];
        const codUser = await this.consultaBancoService.pesquisarCodUsuario(this.email);

          if (codUser === -1) {
            // Usuário não existe, cria um novo
            const novoUsuario = {
                codUser: 0, // Será atribuído automaticamente pelo contador
                email: this.email,
                nome: this.nome,
                tipoPessoa: 'usuario',
                evolucao: [],
            };
            await this.cadastroService.novoUsuario(novoUsuario, (progress) => {});
              this.router.navigate(['/dash-usuario', novoUsuario.codUser]);
            } else {
              this.router.navigate(['/dash-usuario', codUser]);
            }
          } else {
            console.error('Erro: E-mail do usuário não encontrado.');
            this.exibirAlerta('Erro ao obter dados do Google.');
          }
    } catch (error) {
      console.error('Erro ao fazer login com Google: ', error);
      this.exibirAlerta('Erro ao fazer login com Google.');
    }
  }

  async logOut() {
    try {
     await this.auth.signOut();
     this.router.navigate(['/home']);
    } 
    catch (e) {
      console.error(e);
      console.log('Erro logout');
    }
  }

  async resetarSenha(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email);
  }

}
