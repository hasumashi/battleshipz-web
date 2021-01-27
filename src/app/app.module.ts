import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainViewComponent } from './main-view/main-view.component';
import { InvitePanelComponent } from './main-view/panels/invite-panel/invite-panel.component';
import { MatchmakerPanelComponent } from './main-view/panels/matchmaker-panel/matchmaker-panel.component';
import { RankingPanelComponent } from './main-view/panels/ranking-panel/ranking-panel.component';
import { WelcomeCardComponent } from './main-view/welcome-card/welcome-card.component';
import { ButtonCardComponent } from './shared/button-card/button-card.component';
import { PrepareBoardViewComponent } from './prepare-board-view/prepare-board-view.component';
import { BattleViewComponent } from './battle-view/battle-view.component';
import { GameBoardComponent } from './shared/game-board/game-board.component';
import { ElsePipe } from './shared/else.pipe';
import { ShipPlaceholderComponent } from './shared/ship-placeholder/ship-placeholder.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		MainViewComponent,
		InvitePanelComponent,
		MatchmakerPanelComponent,
		RankingPanelComponent,
		WelcomeCardComponent,
		ButtonCardComponent,
		PrepareBoardViewComponent,
		BattleViewComponent,
		GameBoardComponent,
		ElsePipe,
		ShipPlaceholderComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,

		// Angular Material
		MatCardModule,
		MatDividerModule,
		MatButtonModule,
		MatProgressSpinnerModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
