import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  ActionSheetController,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonThumbnail,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  imageOutline,
  personCircleOutline,
  settingsOutline,
  locationOutline,
  shareOutline,
  speedometerOutline,
  timeOutline,
  heartOutline,
  chevronForwardOutline,
  flameOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonLabel,
    IonList,
    IonItem,
    IonThumbnail
  ]
})
export class ProfilePage implements OnInit {
  @ViewChild('profileInput') profileInput!: ElementRef;
  @ViewChild('coverInput') coverInput!: ElementRef;

  user: User | null = null;
  avatar = 'assets/default-avatar.jpg';
  coverPhoto = 'assets/default-cover.jpg';
  bio = 'Welcome to UNPADYAK!';
  location = 'Vigan City';
  stats = { followers: 0, following: 0, totalDistance: 0, totalTime: 0 };

  recentActivities: any[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {
    addIcons({
      cameraOutline,
      imageOutline,
      personCircleOutline,
      settingsOutline,
      locationOutline,
      shareOutline,
      speedometerOutline,
      timeOutline,
      heartOutline,
      chevronForwardOutline,
      flameOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.auth.getCurrentUser();
    // Optionally, load avatar, coverPhoto, bio, etc. from user profile if you extend the model
  }

  formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Refresh data
      event.target.complete();
    }, 1500);
  }

  async selectProfilePicture() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Profile Picture',
      buttons: [
        {
          text: 'Choose from Files',
          icon: 'image-outline',
          handler: () => {
            this.profileInput.nativeElement.click();
          }
        },
        {
          text: 'Take Photo',
          icon: 'camera-outline',
          handler: () => {
            console.log('Take photo clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async selectCoverPhoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Cover Photo',
      buttons: [
        {
          text: 'Choose from Files',
          icon: 'image-outline',
          handler: () => {
            this.coverInput.nativeElement.click();
          }
        },
        {
          text: 'Take Photo',
          icon: 'camera-outline',
          handler: () => {
            console.log('Take photo clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  onProfilePhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.user) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user!.avatar = e.target.result;
        // Update user in localStorage (users array)
        const users = JSON.parse(localStorage.getItem('unpadyak_users') || '[]');
        const idx = users.findIndex((u: any) => u.username === this.user!.username);
        if (idx !== -1) {
          users[idx].avatar = e.target.result;
          localStorage.setItem('unpadyak_users', JSON.stringify(users));
        }
        // Update session
        localStorage.setItem('unpadyak_session', JSON.stringify(this.user));
      };
      reader.readAsDataURL(file);
    }
  }

  onCoverPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.user) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user!.coverPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  shareProfile() {
    // Implement share functionality
  }

  editProfile() {
    // Navigate to edit profile
  }

  viewFollowers() {
    // Navigate to followers list
  }

  viewFollowing() {
    // Navigate to following list
  }

  viewAllActivities() {
    // Navigate to activities list
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Log Out',
          handler: () => {
            // Clear any stored data
            localStorage.removeItem('auth_token');
            // Navigate to login
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  get profileAvatar() {
    return this.user && this.user.avatar ? this.user.avatar : 'assets/default-avatar.jpg';
  }
  get profileCoverPhoto() {
    return this.user && this.user.coverPhoto ? this.user.coverPhoto : 'assets/default-cover.jpg';
  }
  get displayBio() {
    return this.user?.bio || 'Welcome to UNPADYAK!';
  }
  get displayLocation() {
    return this.user?.location || 'Vigan City';
  }
  get displayStats() {
    return this.user?.stats || { followers: 0, following: 0, totalDistance: 0, totalTime: 0 };
  }
}
