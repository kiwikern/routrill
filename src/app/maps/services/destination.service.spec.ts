import { TestBed } from '@angular/core/testing';

import { GOOGLE } from '../maps.module';
import { DestinationService } from './destination.service';
import { ElevationService } from './elevation.service';

class PlacesServiceMock {

}

class AutocompleteServiceMock {

}


describe('DestinationService', () => {
  let mockedGoogle;
  beforeEach(() => {
    mockedGoogle = {maps: {places: {PlacesService: PlacesServiceMock, AutocompleteService: AutocompleteServiceMock}}};

    TestBed.configureTestingModule({
      providers: [
        DestinationService,
        {provide: ElevationService, useValue: mockedGoogle},
        {provide: GOOGLE, useValue: mockedGoogle}
      ]
    });
  });

  it('should be created', () => {
    const service = new DestinationService(null, mockedGoogle);
    expect(service).toBeTruthy();
  });
});
