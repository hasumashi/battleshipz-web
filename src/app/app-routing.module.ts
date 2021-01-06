import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainViewComponent } from './main-view/main-view.component';
import { InvitePanelComponent } from './main-view/panels/invite-panel/invite-panel.component';
import { MatchmakerPanelComponent } from './main-view/panels/matchmaker-panel/matchmaker-panel.component';
import { RankingPanelComponent } from './main-view/panels/ranking-panel/ranking-panel.component';

const routes: Routes = [
	{
		path: '', component: MainViewComponent,
		children: [
			// { path: 'login', component: LoginPanelComponent },
			// { path: 'account', component: AccountPanelComponent },
			{ path: 'invite', component: InvitePanelComponent, data: { title: 'Play with a friend' } },
			{ path: 'random', component: MatchmakerPanelComponent, data: { title: 'Random game' } },
			{ path: 'ranking', component: RankingPanelComponent, data: { title: 'Ranking' } },
		]
	},
	{ path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
