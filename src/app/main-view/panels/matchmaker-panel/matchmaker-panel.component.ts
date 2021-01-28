import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

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

	constructor(private router: Router, private socket: Socket) {
		socket.on('playersOnline', (online: number) => {
			this.playersAvailable = Math.max(0, online - 1);
		});

		socket.on('game:ready', () => {
			this.router.navigate(['/prepare']);
		})
	}

	ngOnInit(): void {
	}

	startSearching() {
		this.matchmakingState = MatchmakingState.Searching;
		this.timer.startTimer();

		this.socket.emit('game:request');

		// TODO mocked navigation
		// setTimeout(() => {
		// 	this.router.navigate(['/prepare']);
		// }, 800);
	}

	cancelSearching() {
		this.matchmakingState = MatchmakingState.Idle;
		this.timer.resetTimer();
	}
}
