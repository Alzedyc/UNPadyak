import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true, // ✅ Ensure this is true for standalone components
  imports: [IonicModule] // ✅ Import IonicModule
})
export class HomePage {} // ✅ Ensure class name matches the import in routing
