import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ReplaySubject, from, shareReplay } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PlayersService {

	constructor(private socket: Socket) { }

	playersOnline$ = this.socket.fromEvent<number>('playersOnline').pipe(shareReplay(1));

}
