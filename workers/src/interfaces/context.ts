import {Container} from '../container';
export interface AppContext extends CloudflareBindings {
  container: Container;
}
