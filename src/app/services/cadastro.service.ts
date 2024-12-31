import { Injectable } from '@angular/core';
import { Usuario } from '../models/structures';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(
    private db: AngularFireDatabase, // Garantindo que a injeção é feita corretamente
  ) { }

  async novoUsuario(usuario: Usuario, progressCallback: (percentage: number) => void): Promise<void> {
    try {
      progressCallback(40);
      const codigo = await this.contador();  
      usuario.codUser = codigo;
      usuario.tipoPessoa = "usuario";
    
      progressCallback(90);
      const userRef = this.db.object(`usuarios/${usuario.codUser}`);
      await userRef.set(usuario);

      progressCallback(100);

    } catch (error) {
      console.error('Erro ao cadastrar usuário', error);
      throw error;
    }
  }

  async contador(): Promise<number> {
    try {
      const snapshot = await this.db.list('usuarios').query.once('value');
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        let nextPosition = 1;

        while (keys.includes(nextPosition.toString())) {
          nextPosition++;
        }
        return nextPosition;
      } else {
        return 1;
      }
    } catch (error) {
      console.error('Erro ao obter o contador de usuários:', error);
      throw error;
    }
  }

}
