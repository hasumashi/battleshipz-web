import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

	constructor(private router: Router) { }

	ngOnInit(): void {
	}

	startSearching() {
		this.matchmakingState = MatchmakingState.Searching;
		this.timer.startTimer();

		// TODO mocked navigation
		setTimeout(() => {
			this.router.navigate(['/prepare']);
		}, 5500);
	}

	cancelSearching() {
		this.matchmakingState = MatchmakingState.Idle;
		this.timer.resetTimer();
	}
}
