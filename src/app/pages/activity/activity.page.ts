import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeedService, Post } from 'src/app/services/feed.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface ActivityItem {
  type: 'post' | 'like' | 'comment';
  timestamp: Date;
  post: Post;
  details?: string;
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    RouterModule,
    TimeAgoPipe
  ]
})
export class ActivityPage implements OnInit, OnDestroy {
  activities: ActivityItem[] = [];
  private postsSubscription?: Subscription;

  constructor(private feedService: FeedService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.postsSubscription = this.feedService.getCurrentUserPosts().subscribe(posts => {
      // Create a new array for activities
      const newActivities: ActivityItem[] = [];
      [...posts].reverse().forEach(post => {
        newActivities.push({
          type: 'post',
          timestamp: post.createdAt,
          post: post,
          details: `You posted a new ${post.activity.name.toLowerCase()} activity`
        });
      });
      this.activities = newActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'post':
        return 'add-circle-outline';
      case 'like':
        return 'heart-outline';
      case 'comment':
        return 'chatbubble-outline';
      default:
        return 'ellipsis-horizontal-outline';
    }
  }
}
