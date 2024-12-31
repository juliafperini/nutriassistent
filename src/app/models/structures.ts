export class Usuario {
    codUser: number | null = null;
    nome: string = '';
    email: string = '';
    tipoPessoa: string = '';
    evolucao: Evolucao[] = [];
  }

  export class Alimento {
    idAlimento: number | null = null;
    descricao: string = '';
    grupo: string = '';
    umidade: number | any = null;
    caloria: number | any = null;
    jaule: number | any = null;
    proteina: number | any = null;
    lipidios: number | any = null;
    colesterol: number | any = null;
    carbo: number | any = null;
    fibra: number | any = null;
    cinzas: number | any = null;
    calcio: number | any = null;
    magnesio: number | any = null;
  }

  export class Evolucao {
    [key: string]: number | string | Date | null; // Incluído o tipo Date no índice dinâmico
    codUser: number | null = null;
    codEv: number | null = null;
    peso: number | null = null;
    quadril: number | null = null;
    coxa: number | null = null;
    braco: number | null = null;
    cintura: number | null = null;
    abdomen: number | null = null;
    dataf: string = '';
    data: Date = new Date();
  }


  export class AlimentoPr {
    idAlimento: number | null = null;
    origem: string = '';
    grupo: string = '';
    descricao: string = '';
    caloria: number | any = null;
    carbo: number | any = null;
    proteina: number | any = null;
    lipidios: number | any = null;
  }

  export class Refeicao {
    numRf: number | null = null;
    caloriaRef: number | any = null;
    proteinaRef: number | any = null;
    carboRef: number | any = null;
    lipRef: number | any = null; // Adicione esta linha
    alimentosRef: AlimentoRef[] = [];
    quantAlimentos: number = 0;
  }

  export class AlimentoRef {
    idAlimRef: number | null = null;
    idRefeicao: number | null = null;
    quantAlimento: number = 0;
    alimentoFonte: string = '';
    alimentoDesc: string = '';
    alimentoGrupo: string = '';
    caloriaAlim: number | any = null;
    proteinaAlim: number | any = null;
    carbAlim: number | any = null;
    lipAlim: number | any = null;
    substituto: boolean = false;
  }


  
