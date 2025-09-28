import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class SignupPage {
  email = '';
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService, private toastCtrl: ToastController) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async onSignup() {
    this.errorMessage = '';
    if (!this.email || !this.username || !this.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }
    const result = this.auth.signup({ email: this.email, username: this.username, password: this.password });
    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }
    const toast = await this.toastCtrl.create({
      message: result.message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    toast.present();
    setTimeout(() => this.router.navigate(['/login']), 2000);
  }

  validateEmail(email: string): boolean {
    return /^\S+@\S+\.\S+$/.test(email);
  }
} 