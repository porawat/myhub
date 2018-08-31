import { Component, ViewChild } from '@angular/core';
import { Nav, Platform ,Modal, ModalController,PopoverController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { CompeterPage } from '../pages/competer/competer';
import { LivescorePage } from '../pages/livescore/livescore';
import { CompetitionPage } from '../pages/competition/competition';
import {PlaystepPage} from '../pages/playstep/playstep';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any =  HomePage;

  pages: Array<{title: string, component: any,icon: string,color:any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    private modal: ModalController,
    public popoverCtrl: PopoverController,
    public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage ,icon:'football',color:'danger'},
      { title: 'step', component: PlaystepPage ,icon:'fastforward',color:'ballstep'},
      { title: 'ตั้งค่า', component: CompetitionPage ,icon:'cog',color:'dark'},
      { title: 'Livescore', component: LivescorePage ,icon:'globe',color:'secondary'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
