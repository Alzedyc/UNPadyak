import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SettingsPage implements OnInit {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  async editProfile() {
    // Navigate to profile edit page
    this.router.navigate(['/profile']);
  }

  async notifications() {
    // Navigate to notifications settings
    this.router.navigate(['/notifications']);
  }

  async privacy() {
    // Navigate to privacy settings
    this.router.navigate(['/privacy']);
  }

  async help() {
    // Navigate to help page
    this.router.navigate(['/help']);
  }

  async about() {
    // Navigate to about page
    this.router.navigate(['/about']);
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
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}
