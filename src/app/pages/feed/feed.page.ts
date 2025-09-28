import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PostModalComponent } from 'src/app/components/post-modal/post-modal.component';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { FeedService, Post } from 'src/app/services/feed.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeAgoPipe
  ]
})
export class FeedPage implements OnInit, OnDestroy {
  posts: Post[] = [];
  currentUser = { username: '', avatar: '' };
  private postsSubscription?: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private feedService: FeedService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.currentUser = {
      username: user?.username || 'Unknown',
      avatar: user?.avatar || 'assets/machinarium.png'
    };
    this.postsSubscription = this.feedService.getPosts()
      .subscribe(posts => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSubscription?.unsubscribe();
  }

  async presentPostModal() {
    const modal = await this.modalCtrl.create({
      component: PostModalComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.activity) {
      const newPost: Omit<Post, 'id' | 'likes' | 'likedByUser' | 'comments' | 'showComments' | 'newComment' | 'user' | 'createdAt'> = {
        activity: {
          name: data.activity.type.name,
          icon: data.activity.type.icon
        },
        distance: data.activity.distance,
        time: data.activity.time,
        caption: data.activity.caption,
        image: data.activity.image
      };
      this.feedService.addPost(newPost);
    }
  }

  toggleLike(post: Post) {
    this.feedService.toggleLike(post.id);
  }

  toggleComments(post: Post) {
    this.feedService.toggleComments(post.id);
  }

  addComment(post: Post) {
    if (post.newComment.trim()) {
      this.feedService.addComment(post.id, {
        user: this.currentUser,
        text: post.newComment
      });
    }
  }
}
