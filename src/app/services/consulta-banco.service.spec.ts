import { TestBed } from '@angular/core/testing';

import { ConsultaBancoService } from './consulta-banco.service';

describe('ConsultaBancoService', () => {
  let service: ConsultaBancoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaBancoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
