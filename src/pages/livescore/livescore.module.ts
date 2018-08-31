import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivescorePage } from './livescore';

@NgModule({
  declarations: [
    LivescorePage,
  ],
  imports: [
    IonicPageModule.forChild(LivescorePage),
  ],
})
export class LivescorePageModule {}
