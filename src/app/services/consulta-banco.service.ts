import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { Observable, first, map } from 'rxjs';
import { Alimento, Usuario } from '../models/structures';

@Injectable({
  providedIn: 'root'
})
export class ConsultaBancoService {

  constructor(
    private db: AngularFireDatabase,
    public auth: AngularFireAuth,
  ) { 

  }

  async pesquisarCodUsuario(email: string): Promise<number> {
    const snapshot = await this.db.list(`usuarios`).snapshotChanges().pipe(first()).toPromise();
    
    if (snapshot) {
      // Verificar se o e-mail desejado está presente nos e-mails dos usuários
      const usuarioEncontrado = snapshot
        .map(usuario => usuario.payload?.val() as Usuario) // Mapear os dados para a classe Usuario
        .find(usuario => usuario.email === email); // Comparar o email diretamente
  
      if (usuarioEncontrado && usuarioEncontrado.codUser) {
        // Verifica se codUser é null ou undefined e atribui um valor padrão (-1)
        return usuarioEncontrado.codUser;
      }
    }
    return -1; // Retornar -1 se não encontrar o usuário
  }

  async pesquisarTipoPessoa(emailDesejado: string): Promise<string | null> {
    try {
      // Recupera a lista de usuários
      const snapshot = await this.db.list('usuarios').snapshotChanges().pipe(first()).toPromise();
  
      if (snapshot) {
        // Encontra o usuário cujo email corresponde ao email desejado
        const usuarioEncontrado = snapshot
          .map(usuario => usuario.payload.val() as { email?: string, tipoPessoa?: string })
          .find(usuarioData => usuarioData.email === emailDesejado);
  
        // Retorna o tipoPessoa se o usuário for encontrado
        if (usuarioEncontrado && usuarioEncontrado.tipoPessoa) {
          return usuarioEncontrado.tipoPessoa;
        }
      }
  
      return null; // Retorna null se não encontrar o email ou tipoPessoa
    } catch (error) {
      console.error('Erro ao pesquisar tipo de pessoa:', error);
      return null;
    }
  }

  async obterUsuario(codUser: number): Promise<Usuario | null> {
    try {
      const snapshot = await this.db.object(`usuarios/${codUser}`).query.once('value');
      const usuario = snapshot.val() as Usuario; //remover as Relato
      return usuario;  //antes: return relato || null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  }


  obterAlimentos(): Observable<Alimento[]> {
    return this.db.list<Alimento>('alimentos').snapshotChanges().pipe(
      map((snapshotChanges) =>
        snapshotChanges.map((snapshot) => {
          const data = snapshot.payload.val() as Alimento;
          return {
            ...data,
            idAlimento: Number(snapshot.key), // Converte para número
          } as Alimento;
        })
      )
    );
  }

  obterGruposAlimentos(): Observable<string[]> {
    return this.db.list<Alimento>('alimentos').snapshotChanges().pipe(
      map((snapshotChanges) =>
        snapshotChanges.map((snapshot) => {
          const data = snapshot.payload.val() as Alimento;
          return data.grupo.trim(); // Retorna apenas o grupo
        })
      ),
      map((grupos) => Array.from(new Set(grupos)).sort((a, b) => a.localeCompare(b))) // Remove duplicados e ordena
    );
  }




}
