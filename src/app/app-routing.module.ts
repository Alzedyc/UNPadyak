import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'splash', 
    pathMatch: 'full' 
  },
  { 
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  { 
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  { 
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },   
  { 
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { 
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.page').then(m => m.FeedPage)
      },
      { 
        path: 'activity',
        loadComponent: () => import('./pages/activity/activity.page').then(m => m.ActivityPage)
      },
      { 
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },
      { 
        path: 'leaderboard',
        loadComponent: () => import('./pages/leaderboard/leaderboard.page').then(m => m.LeaderboardPage)
      },
      { 
        path: '', 
        redirectTo: 'feed', 
        pathMatch: 'full' 
      }
    ]
  },
  { 
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage)
  },
  { 
    path: '**', 
    redirectTo: 'splash' // Fallback for unknown routes
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { 
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking' // Recommended for SSR compatibility
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}