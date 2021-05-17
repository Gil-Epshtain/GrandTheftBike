import { TestBed } from '@angular/core/testing';

import { ServerV2Service } from './server-v2.service';

describe('ServerV2Service', () => {
  let service: ServerV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
