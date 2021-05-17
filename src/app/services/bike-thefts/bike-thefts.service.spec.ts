import { TestBed } from '@angular/core/testing';

import { BikeTheftsService } from './bike-thefts.service';

describe('BikeTheftsService', () => {
  let service: BikeTheftsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BikeTheftsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
