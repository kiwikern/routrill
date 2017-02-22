/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DistanceService } from './distance.service';

describe('DistanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistanceService]
    });
  });

  it('should ...', inject([DistanceService], (service: DistanceService) => {
    expect(service).toBeTruthy();
  }));
});
