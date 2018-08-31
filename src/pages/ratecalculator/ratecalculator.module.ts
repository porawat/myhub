import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatecalculatorPage } from './ratecalculator';

@NgModule({
  declarations: [
    RatecalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(RatecalculatorPage),
  ],
})
export class RatecalculatorPageModule {}
