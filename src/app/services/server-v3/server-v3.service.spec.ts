import { TestBed } from '@angular/core/testing';

import { ServerV3Service } from './server-v3.service';

describe('ServerV3Service', () => {
  let service: ServerV3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerV3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
