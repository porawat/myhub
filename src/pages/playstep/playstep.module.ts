import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaystepPage } from './playstep';

@NgModule({
  declarations: [
    PlaystepPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaystepPage),
  ],
})
export class PlaystepPageModule {}
