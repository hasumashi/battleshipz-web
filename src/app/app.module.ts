import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainViewComponent } from './main-view/main-view.component';
import { InvitePanelComponent } from './main-view/panels/invite-panel/invite-panel.component';
import { MatchmakerPanelComponent } from './main-view/panels/matchmaker-panel/matchmaker-panel.component';
import { RankingPanelComponent } from './main-view/panels/ranking-panel/ranking-panel.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		MainViewComponent,
		InvitePanelComponent,
		MatchmakerPanelComponent,
		RankingPanelComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,

		// Angular Material
		MatCardModule,
		MatDividerModule,
		MatButtonModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
