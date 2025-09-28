import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'feed', loadChildren: () => import('../feed/feed.module').then(m => m.FeedPageModule) },
      { path: 'activity', loadChildren: () => import('../activity/activity.module').then(m => m.ActivityPageModule) },
      { path: 'profile', loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage) },
      { path: 'leaderboard', loadChildren: () => import('../leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule) },
      { path: '', redirectTo: '/tabs/feed', pathMatch: 'full' } // Default tab
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
