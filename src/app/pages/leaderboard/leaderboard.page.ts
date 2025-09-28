import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonBadge,
  IonIcon,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bicycle,
  walk,
  footstepsOutline,
  trophy,
  medalOutline
} from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
  distance: number;
  rank: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonAvatar,
    IonBadge,
    IonIcon,
    IonRefresher,
    IonRefresherContent
  ]
})
export class LeaderboardPage implements OnInit {
  selectedActivity = 'cycling';
  currentUser: any = null;
  
  cyclingLeaderboard: LeaderboardUser[] = [
    {
      id: 1,
      name: 'Russel',
      username: '@padyakingpin',
      avatar: 'assets/avatars/user1.jpg',
      distance: 150.5,
      rank: 1
    },
    {
      id: 2,
      name: 'Aldwin Rex',
      username: '@dutirtebike',
      avatar: 'assets/avatars/user2.jpg',
      distance: 142.3,
      rank: 2
    },
    {
      id: 3,
      name: 'Mang Ken',
      username: '@mangkanor_wheels',
      avatar: 'assets/avatars/user3.jpg',
      distance: 135.8,
      rank: 3
    },
    {
      id: 4,
      name: 'Jhay-Ahr',
      username: '@nenangbike',
      avatar: 'assets/avatars/user4.jpg',
      distance: 128.4,
      rank: 4
    },
    {
      id: 5,
      name: 'Alamarc',
      username: '@juandelabike',
      avatar: 'assets/avatars/user5.jpg',
      distance: 120.1,
      rank: 5
    }
  ];

  runningLeaderboard: LeaderboardUser[] = [
    {
      id: 6,
      name: 'Kuya Jobert Runner',
      username: '@jobertakbo',
      avatar: 'assets/avatars/user6.jpg',
      distance: 42.5,
      rank: 1
    },
    {
      id: 7,
      name: 'Ate Guy Sprinter',
      username: '@nora_run',
      avatar: 'assets/avatars/user7.jpg',
      distance: 38.9,
      rank: 2
    },
    {
      id: 8,
      name: 'Bokya Takbo',
      username: '@bokyarunner',
      avatar: 'assets/avatars/user8.jpg',
      distance: 35.2,
      rank: 3
    },
    {
      id: 9,
      name: 'Tito Boy Takbo',
      username: '@titoboy_runs',
      avatar: 'assets/avatars/user9.jpg',
      distance: 32.7,
      rank: 4
    },
    {
      id: 10,
      name: 'Maria Clara Runner',
      username: '@mariang_takbo',
      avatar: 'assets/avatars/user10.jpg',
      distance: 30.5,
      rank: 5
    }
  ];

  walkingLeaderboard: LeaderboardUser[] = [
    {
      id: 11,
      name: 'Manong Lakad',
      username: '@lakadking',
      avatar: 'assets/avatars/user11.jpg',
      distance: 85.3,
      rank: 1
    },
    {
      id: 12,
      name: 'Inday Walker',
      username: '@indaysteps',
      avatar: 'assets/avatars/user12.jpg',
      distance: 82.1,
      rank: 2
    },
    {
      id: 13,
      name: 'Totoy Lakad',
      username: '@totoysteps',
      avatar: 'assets/avatars/user13.jpg',
      distance: 78.6,
      rank: 3
    },
    {
      id: 14,
      name: 'Aling Bebang Steps',
      username: '@bebangwalks',
      avatar: 'assets/avatars/user14.jpg',
      distance: 75.4,
      rank: 4
    },
    {
      id: 15,
      name: 'Mang Jose Walker',
      username: '@josewalk',
      avatar: 'assets/avatars/user15.jpg',
      distance: 72.8,
      rank: 5
    }
  ];

  constructor(private auth: AuthService) {
    addIcons({
      bicycle,
      walk,
      footstepsOutline,
      trophy,
      medalOutline
    });
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 1500);
  }

  formatDistance(distance: number): string {
    return `${distance.toFixed(1)} km`;
  }

  getActivityIcon(activity: string): string {
    switch (activity) {
      case 'cycling':
        return 'bicycle';
      case 'running':
        return 'running';
      case 'walking':
        return 'walk';
      default:
        return 'bicycle';
    }
  }

  getCurrentLeaderboard(): LeaderboardUser[] {
    const leaderboard = (() => {
      switch (this.selectedActivity) {
        case 'cycling': return this.cyclingLeaderboard;
        case 'running': return this.runningLeaderboard;
        case 'walking': return this.walkingLeaderboard;
        default: return this.cyclingLeaderboard;
      }
    })();
    // Update avatar for current user
    if (this.currentUser) {
      return leaderboard.map(user =>
        user.username === this.currentUser.username
          ? { ...user, avatar: this.currentUser.avatar || user.avatar }
          : user
      );
    }
    return leaderboard;
  }

  getRankColor(rank: number): string {
    switch (rank) {
      case 1:
        return 'warning'; // Gold
      case 2:
        return 'medium'; // Silver
      case 3:
        return 'tertiary'; // Bronze
      default:
        return 'medium';
    }
  }
}
