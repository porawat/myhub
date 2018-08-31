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
import { Facebook } from '@ionic-native/facebook';
import { Camera} from '@ionic-native/camera';
import { DatePicker } from '@ionic-native/date-picker';
import {MyDatePickerModule} from 'mydatepicker';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    LivescorePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({name: "__ion_APHUB"}), //ฐานข้อมูลในเครื่อง
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
    LivescorePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FireserviceProvider,
    Sim,
    Facebook,
    InAppBrowser,
    Camera,
    DatePicker,
    
  ]
})
export class AppModule {}
