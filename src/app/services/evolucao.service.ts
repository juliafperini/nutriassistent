import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Evolucao, Usuario } from '../models/structures';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class EvolucaoService {

  constructor(
    public auth: AngularFireAuth,
    private db: AngularFireDatabase,
  ) { }


  async atualizarEvolucao(evolucao: Evolucao, usuario: Usuario,  progressCallback: (percentage: number) => void): Promise<void> {
    const pacienteAtivo = await this.auth.currentUser;
  
    progressCallback(40)
  
    if (pacienteAtivo) {
      try {
        
        evolucao.dataf = this.obterDataAtual();
        evolucao.data = new Date();

          if(usuario.codUser){
            evolucao.codEv = await this.contadorEvolucao(usuario.codUser);
          }
          
        evolucao.codUser = usuario.codUser;

        if (!usuario.evolucao) {
          usuario.evolucao = [];
        }

        usuario.evolucao.push(evolucao);
  
        await this.db.object(`usuarios/${usuario.codUser}/evolucao/${evolucao.codEv}`).set(evolucao);
        
  
      } catch (error) {
        console.error('Erro ao adicionar relato:', error);
        throw error;
      }
    } else {
      console.log('Usuário não autenticado');
    }
  }

  private obterDataAtual(): string {
    const dataAtual = new Date();
    const dia = this.adicionarZero(dataAtual.getDate());
    const mes = this.adicionarZero(dataAtual.getMonth() + 1); // Meses começam do zero no JavaScript
    const ano = dataAtual.getFullYear();
    return `${dia}/${mes}/${ano}`;
   }

   private adicionarZero(numero: number): string {
    return numero < 10 ? `0${numero}` : numero.toString();
  }

  private async contadorEvolucao(codUser: number): Promise<number> {
    try {
      // Obter a lista de nutricionistas do paciente no Firebase
      const snapshot = await this.db.list(`usuarios/${codUser}/evolucao`).query.once('value');

      if (snapshot.exists()) {
        // Obter as chaves dos relatos existentes
        const keys = Object.keys(snapshot.val());

        // Encontrar o próximo número/posição vazia
        let nextPosition = 1;
        while (keys.includes(nextPosition.toString())) {
          nextPosition++;
        }

        return nextPosition;
      } else {
        // Se não há relatos existentes, o próximo número é 1
        return 1;
      }
    } catch (error) {
      console.error('Erro ao obter o contador de pacientes:', error);
      throw error;
    }
  }

  async obterUltimasEvolucoes(codUser: number): Promise<Evolucao[]> {
    try {
      // Obter a lista de evoluções do paciente no Firebase
      const snapshot = await this.db.list(`usuarios/${codUser}/evolucao`).query.limitToLast(10).once('value');
      
      const evolucoes: Evolucao[] = [];
      snapshot.forEach((childSnapshot) => {
        const evolucao = childSnapshot.val();
        evolucoes.push(evolucao);
      });

      // Retorna as evoluções ordenadas pela data
      return evolucoes.sort((a, b) => new Date(b.dataf).getTime() - new Date(a.dataf).getTime());

    } catch (error) {
      console.error('Erro ao obter evoluções do Firebase:', error);
      throw error;
    }
  }
  
}
