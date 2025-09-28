import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; 
import { Router } from '@angular/router'; // ✅ Import Router

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class SplashPage {
  constructor(private router: Router) {} // ✅ Inject Router

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/login'); // ✅ Redirect to Login after 3 seconds
    }, 3000);
  }
}
