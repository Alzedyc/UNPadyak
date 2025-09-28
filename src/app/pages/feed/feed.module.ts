import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeedPageRoutingModule } from './feed-routing.module';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedPageRoutingModule,
    TimeAgoPipe
  ]
})
export class FeedPageModule {}
