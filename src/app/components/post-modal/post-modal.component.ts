// components/post-modal/post-modal.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivityService, ActivityData } from 'src/app/services/activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PostModalComponent implements OnDestroy {
  activityTypes = [
    { name: 'Running', icon: '🏃‍♂️' },
    { name: 'Cycling', icon: '🚴‍♂️' },
    { name: 'Walking', icon: '🚶‍♂️' }
  ];

  activity = {
    type: this.activityTypes[0],
    distance: 0,
    time: '0:00',
    caption: '',
    image: null as string | null
  };

  isTracking = false;
  speed = 0;
  private activitySubscription?: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private activityService: ActivityService
  ) {}

  ngOnDestroy() {
    this.activitySubscription?.unsubscribe();
    if (this.isTracking) {
      this.activityService.stopTracking();
    }
  }

  dismiss() {
    if (this.isTracking) {
      this.activityService.stopTracking();
    }
    this.modalCtrl.dismiss();
  }

  async toggleTracking() {
    if (!this.isTracking) {
      try {
        this.isTracking = true;
        this.activitySubscription = (await this.activityService.startTracking())
          .subscribe((data: ActivityData) => {
            this.activity.distance = Number(data.distance.toFixed(2));
            this.activity.time = data.time;
            this.speed = data.speed || 0;
          });
      } catch (error) {
        console.error('Error starting tracking:', error);
        this.isTracking = false;
      }
    } else {
      const finalData = await this.activityService.stopTracking();
      this.activity.distance = Number(finalData.distance.toFixed(2));
      this.activity.time = finalData.time;
      this.speed = 0;
      this.isTracking = false;
    }
  }

  async postActivity() {
    if (this.isTracking) {
      await this.toggleTracking(); // Stop tracking if still active
    }
    
    this.modalCtrl.dismiss({
      activity: {
        type: this.activity.type,
        distance: this.activity.distance,
        time: this.activity.time,
        caption: this.activity.caption,
        image: this.activity.image
      }
    });
  }

  async selectImage() {
    try {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use the back camera if available
      
      // Handle file selection
      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // Convert the file to a data URL
          const reader = new FileReader();
          reader.onload = () => {
            this.activity.image = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      };
      
      // Trigger the file input
      input.click();
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
}
