import { TestBed } from '@angular/core/testing';

import { ElevationService } from './elevation.service';
import { GOOGLE } from '../maps.module';

class MockElevationService {

}


describe('ElevationService', () => {
  let mockedGoogle;
  beforeEach(() => {
    mockedGoogle = {maps: {ElevationService: MockElevationService}};

    TestBed.configureTestingModule({
      providers: [
        ElevationService,
        {provide: GOOGLE, useValue: mockedGoogle}
      ]
    });
  });

  it('should be created', () => {
    const service = new ElevationService(mockedGoogle);
    expect(service).toBeTruthy();
  });
});
