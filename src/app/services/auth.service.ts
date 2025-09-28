import { Injectable } from '@angular/core';

export interface User {
  email: string;
  username: string;
  password: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  stats?: {
    followers: number;
    following: number;
    totalDistance: number;
    totalTime: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'unpadyak_users';
  private sessionKey = 'unpadyak_session';

  // Signup: add user to localStorage
  signup(user: User): { success: boolean; message: string } {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    if (users.some(u => u.username === user.username)) {
      return { success: false, message: 'Username already exists.' };
    }
    if (users.some(u => u.email === user.email)) {
      return { success: false, message: 'Email already exists.' };
    }
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return { success: true, message: 'Account created! Please log in.' };
  }

  // Login: check credentials and set session
  login(emailOrUsername: string, password: string): { success: boolean; message: string } {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid credentials.' };
    }
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
    return { success: true, message: 'Login successful.' };
  }

  // Logout: remove session
  logout() {
    localStorage.removeItem(this.sessionKey);
  }

  // Get current user
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.sessionKey);
    return user ? JSON.parse(user) : null;
  }

  // Is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.sessionKey);
  }
} 