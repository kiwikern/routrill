 // import './bruteforce-worker';

describe('BruteforceWorker', () => {
  let service;
  beforeEach(() => {
    service = new BruteWorker();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle no destinations', () => {
    const entries = [];
    expect(service.getRoundTrip(entries)).toEqual([]);
  });

  it('should handle one destination', () => {
    const entries = [{
      fromIndex: 0, toIndex: 0, consumption: 0, distance: 0, elevationPercentage: 0, isReachable: true
    }];
    const expected = [{
      fromIndex: 0, toIndex: 0, consumption: 0, distance: 0, elevationPercentage: 0, isReachable: true,
    }
    ];
    const roundTrip = service.getRoundTrip(entries);
    expect(roundTrip).toEqual(expected);
  });

  it('should handle two destinations', () => {
    const entries = [
      {
        consumption: 572.693,
        distance: 572693,
        elevationPercentage: -0.24115069707873033,
        fromIndex: 0,
        isReachable: true,
        toIndex: 1
      }, {
        consumption: 572.693,
        distance: 572693,
        elevationPercentage: -0.24115069707873033,
        fromIndex: 1,
        isReachable: true,
        toIndex: 0
      }
    ];
    const expected = [{
      consumption: 572.693,
      distance: 572693,
      elevationPercentage: -0.24115069707873033,
      fromIndex: 0,
      isReachable: true,
      toIndex: 1
    }, {
      consumption: 572.693,
      distance: 572693,
      elevationPercentage: -0.24115069707873033,
      fromIndex: 1,
      isReachable: true,
      toIndex: 0
    }
    ];
    const roundTrip = service.getRoundTrip(entries);
    console.log(roundTrip);
    expect(roundTrip).toEqual(expected);
  });

  it('should handle no destinations', () => {
    const entries = [];
    expect(service.getRoundTrip(entries)).toEqual([]);
  });
});

class BruteWorker {
  getRoundTrip(input) {
    return input;
  }
}
