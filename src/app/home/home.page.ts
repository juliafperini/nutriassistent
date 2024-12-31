import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
  ) {}

  async logar(email: string, senha: string) {
    try {
      await this.authService.login(email, senha);
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    }
  }

  loginWithGoogle() {
    try {
      this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      console.log('erro homepage');
    }
  }

}
