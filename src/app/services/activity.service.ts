import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ActivityData {
  distance: number;
  time: string;
  coordinates: Array<{ lat: number; lng: number; timestamp: number }>;
  isTracking: boolean;
  startTime?: Date;
  endTime?: Date;
  speed?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private watchId: number | null = null;
  private activityData = new BehaviorSubject<ActivityData>({
    distance: 0,
    time: '0:00',
    coordinates: [],
    isTracking: false,
    speed: 0
  });
  private timerInterval: any;

  constructor() {}

  async startTracking(): Promise<Observable<ActivityData>> {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      this.activityData.next({
        ...this.activityData.value,
        isTracking: true,
        startTime: new Date(),
        coordinates: [],
        distance: 0,
        speed: 0
      });

      // Start watching position with high accuracy
      this.watchId = navigator.geolocation.watchPosition(
        (position) => this.handlePosition(position),
        (error) => console.error('Error watching position:', error),
        {
          enableHighAccuracy: true,
          timeout: 1000,
          maximumAge: 0
        }
      );

      // Start time tracking
      this.startTimeTracking();

      return this.activityData.asObservable();
    } catch (error) {
      console.error('Error starting tracking:', error);
      throw error;
    }
  }

  async stopTracking(): Promise<ActivityData> {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const finalData = {
      ...this.activityData.value,
      isTracking: false,
      endTime: new Date()
    };

    this.activityData.next(finalData);
    return finalData;
  }

  private startTimeTracking() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.activityData.value.isTracking && this.activityData.value.startTime) {
        const elapsed = Date.now() - this.activityData.value.startTime.getTime();
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        this.activityData.next({
          ...this.activityData.value,
          time: `${minutes}:${seconds.toString().padStart(2, '0')}`
        });
      }
    }, 1000);
  }

  private handlePosition(position: GeolocationPosition) {
    const coordinates = this.activityData.value.coordinates;
    const newCoord = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: position.timestamp
    };

    if (coordinates.length > 0) {
      const distance = this.calculateDistance(
        coordinates[coordinates.length - 1],
        newCoord
      );

      // Calculate current speed (km/h)
      const timeDiff = (newCoord.timestamp - coordinates[coordinates.length - 1].timestamp) / 1000; // seconds
      const speed = (distance / timeDiff) * 3600; // Convert to km/h

      this.activityData.next({
        ...this.activityData.value,
        coordinates: [...coordinates, newCoord],
        distance: Number((this.activityData.value.distance + distance).toFixed(3)),
        speed: Number(speed.toFixed(1))
      });
    } else {
      this.activityData.next({
        ...this.activityData.value,
        coordinates: [newCoord]
      });
    }
  }

  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLon = this.toRad(coord2.lng - coord1.lng);
    const lat1 = this.toRad(coord1.lat);
    const lat2 = this.toRad(coord2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }
} 