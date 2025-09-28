import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,  
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {
  usernameOrEmail = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService, private toastCtrl: ToastController) {}

  async login() {
    this.errorMessage = '';
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    const result = this.auth.login(this.usernameOrEmail, this.password);
    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }
    const toast = await this.toastCtrl.create({
      message: 'Login successful!',
      duration: 1500,
      color: 'success',
      position: 'top'
    });
    toast.present();
    setTimeout(() => this.router.navigate(['/tabs/feed']), 1200);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
