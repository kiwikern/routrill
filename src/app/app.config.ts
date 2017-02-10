import {OpaqueToken} from '@angular/core';
export interface AppConfig {
  GMapsApiKey: string;
}

export let APP_CONFIG = new OpaqueToken('app.config.impl');
