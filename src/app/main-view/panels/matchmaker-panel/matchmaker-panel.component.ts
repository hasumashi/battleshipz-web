import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { PlayersService } from 'src/app/shared/services/players.service';

enum MatchmakingState {
	Idle,
	Searching,
	// Found, // TODO "Accept" button after opponent found
}

@Component({
	selector: 'app-matchmaker-panel',
	templateUrl: './matchmaker-panel.component.html',
	styleUrls: ['./matchmaker-panel.component.scss']
})
export class MatchmakerPanelComponent implements OnInit {

	MatchmakingState = MatchmakingState;

	matchmakingState = MatchmakingState.Idle;
	playersAvailable = 0;

	timer = {
		_intervalId: undefined,
		timeElapsed: 0,
		resetTimer() {
			if (this._intervalId) {
				clearInterval(this._intervalId);
			}
			this.timeElapsed = 0;
		},
		startTimer() {
			this.resetTimer();
			setInterval(() => {
				this.timeElapsed += 1000; // ms (for DatePipe formated 'mm:ss')
			}, 1000);
		}
	};

	constructor(
		private router: Router,
		private socket: Socket,
		private playersService: PlayersService,
	) { }

	ngOnInit(): void {
		this.playersService.playersOnline$.subscribe((playersOnline) => {
			this.playersAvailable = Math.max(0, playersOnline - 1);
		});

		this.socket.on('game:ready', () => {
			this.router.navigate(['/prepare']);
		});
	}

	startSearching() {
		this.matchmakingState = MatchmakingState.Searching;
		this.timer.startTimer();
		this.socket.emit('game:request');
	}

	cancelSearching() {
		this.matchmakingState = MatchmakingState.Idle;
		this.timer.resetTimer();
	}
}
