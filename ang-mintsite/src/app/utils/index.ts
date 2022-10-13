import { environment } from '../../environments/environment';

export function consoleLog(...args) {
  if (!environment.production) {
    console.log(...args);
  }
}
