import {Injectable, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../app.config';

@Injectable()
export class AddressService {

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {

  }


}
