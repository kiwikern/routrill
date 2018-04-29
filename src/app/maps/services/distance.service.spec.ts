import { TestBed } from '@angular/core/testing';

import { GOOGLE } from '../maps.module';
import { DistanceService } from './distance.service';

class DistanceMatrixServiceMock {

}


describe('DistanceService', () => {
  let mockedGoogle;
  beforeEach(() => {
    mockedGoogle = {maps: {DistanceMatrixService: DistanceMatrixServiceMock}};

    TestBed.configureTestingModule({
      providers: [
        DistanceService,
        {provide: GOOGLE, useValue: mockedGoogle}
      ]
    });
  });

  it('should be created', () => {
    const service = new DistanceService(null, null, null, mockedGoogle, null);
    expect(service).toBeTruthy();
  });
});
