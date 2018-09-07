import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { CompetitionPage } from '../pages/competition/competition';
import { CompeterPage } from '../pages/competer/competer';
import { RatecalculatorPage } from '../pages/ratecalculator/ratecalculator';
import {LivescorePage} from '../pages/livescore/livescore';
import {PlaystepPage} from '../pages/playstep/playstep';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase_Config } from './app.firebase';
import { FireserviceProvider } from '../providers/fireservice/fireservice';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { IonicStorageModule } from '@ionic/storage';
import { Sim } from '@ionic-native/sim';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Facebook } from '@ionic-native/facebook';
import { Camera} from '@ionic-native/camera';
import { DatePicker } from '@ionic-native/date-picker';
import {MyDatePickerModule} from 'mydatepicker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import {FocuserDirective} from '../directives/focuser/focuser';
import { Device } from '@ionic-native/device';
import { Firebase } from '@ionic-native/firebase';
import { FcmProvider } from '../providers/fcm/fcm';
// import {enableProdMode} from '@angular/core';
// enableProdMode();
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    CompetitionPage,
    CompeterPage,
    RatecalculatorPage,
    LivescorePage,
    PlaystepPage,
    FocuserDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: 'Go Back',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition',
      activator:'none',
      transition :'ios-transition'
    }),
    IonicStorageModule.forRoot(), //ฐานข้อมูลในเครื่อง
    AngularFireModule.initializeApp(Firebase_Config.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MyDatePickerModule,
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    RegisterPage,
    CompetitionPage,
    CompeterPage,
    RatecalculatorPage,
    LivescorePage,
    PlaystepPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FireserviceProvider,
    Sim,
    Uid,
    Firebase,
    Device,
    AndroidPermissions,
    Keyboard,
    Facebook,
    InAppBrowser,
    Camera,
    DatePicker,
    FcmProvider,
    
  ]
})
export class AppModule {}
