import {OpaqueToken} from '@angular/core';
export interface AppConfig {
  gMapsApiKey: string;
  gMapsPlacesApiUrl: string;
}

export let APP_CONFIG = new OpaqueToken('app.config.impl');
