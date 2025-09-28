import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService, User } from './auth.service';

export interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  activity: {
    name: string;
    icon: string;
  };
  distance: number;
  time: string;
  caption: string;
  image: string | null;
  likes: number;
  likedByUser: boolean;
  comments: Array<{
    user: {
      username: string;
      avatar: string;
    };
    text: string;
  }>;
  showComments: boolean;
  newComment: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private postsKey = 'unpadyak_posts';
  private posts = new BehaviorSubject<Post[]>(this.loadPosts());

  constructor(private auth: AuthService) {}

  private loadPosts(): Post[] {
    const posts = localStorage.getItem(this.postsKey);
    return posts ? JSON.parse(posts).map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })) : [];
  }

  private savePosts(posts: Post[]) {
    localStorage.setItem(this.postsKey, JSON.stringify(posts));
    this.posts.next(posts);
  }

  getPosts(): Observable<Post[]> {
    const user = this.auth.getCurrentUser();
    // Update avatar for current user's posts
    const posts = this.posts.value.map(post => {
      if (user && post.user.username === user.username) {
        return {
          ...post,
          user: {
            ...post.user,
            avatar: user.avatar || 'assets/default-avatar.jpg'
          }
        };
      }
      return post;
    });
    return new BehaviorSubject(posts).asObservable();
  }

  getCurrentUserPosts(): Observable<Post[]> {
    const user = this.auth.getCurrentUser();
    return new BehaviorSubject(
      this.posts.value.filter(post => user && post.user.username === user.username)
    ).asObservable();
  }

  addPost(post: Omit<Post, 'id' | 'likes' | 'likedByUser' | 'comments' | 'showComments' | 'newComment' | 'user' | 'createdAt'>): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      user: {
        username: user.username,
        avatar: user.avatar || 'assets/default-avatar.jpg',
      },
      likes: 0,
      likedByUser: false,
      comments: [],
      showComments: false,
      newComment: '',
      createdAt: new Date()
    };
    const updatedPosts = [newPost, ...this.posts.value];
    this.savePosts(updatedPosts);
  }

  toggleLike(postId: string): void {
    const updatedPosts = this.posts.value.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likedByUser: !post.likedByUser,
          likes: post.likes + (post.likedByUser ? -1 : 1)
        };
      }
      return post;
    });
    this.savePosts(updatedPosts);
  }

  addComment(postId: string, comment: { user: { username: string; avatar: string }; text: string }): void {
    const updatedPosts = this.posts.value.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
          newComment: ''
        };
      }
      return post;
    });
    this.savePosts(updatedPosts);
  }

  toggleComments(postId: string): void {
    const updatedPosts = this.posts.value.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        };
      }
      return post;
    });
    this.savePosts(updatedPosts);
  }
} 