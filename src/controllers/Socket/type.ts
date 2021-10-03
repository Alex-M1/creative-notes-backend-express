import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type TSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
export interface ISockets {
  User: Array<TSocket>;
  Manager: Array<TSocket>;
  SuperAdmin: Array<TSocket>;
}
