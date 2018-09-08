import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, PopoverController ,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
// import { CompeterPage } from '../pages/competer/competer';
import { LivescorePage } from '../pages/livescore/livescore';
import { CompetitionPage } from '../pages/competition/competition';
import { PlaystepPage } from '../pages/playstep/playstep';
import { FireserviceProvider } from '../providers/fireservice/fireservice';
// import { FcmProvider } from '../providers/fcm/fcm';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  public profile: any;
  photoURL: any;
  displayName;
  pages: Array<{ title: string, component: any, icon: string, color: any }>;
  private user: firebase.User;
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public db: AngularFirestore,
    public storage: Storage,
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public fbservice: FireserviceProvider,
    public popoverCtrl: PopoverController,
    public splashScreen: SplashScreen) {
    this.initializeApp();
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'บอล', component: HomePage, icon: 'football', color: 'danger' },
      { title: 'บอล Step', component: PlaystepPage, icon: 'fastforward', color: 'ballstep' },
      { title: 'หวยไทย', component: ListPage, icon: 'calculator', color: 'lotto' },
      { title: 'ตั้งค่า', component: CompetitionPage, icon: 'cog', color: 'dark' },
      { title: 'Livescore', component: LivescorePage, icon: 'globe', color: 'secondary' }
    ];
  
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setonline(true);
      //this.fcm.getToken()

      // Listen to incoming messages
      /*
      this.fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          const toast = this.toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      )
      .subscribe()
      */
    });
    if (this.fbservice.getUid()) {

      let uid = this.fbservice.getUid();
      console.log(uid);
      this.fbservice.getuserinfo(uid).then(snap => {
        snap.onSnapshot(res => {
          console.log(res.data());
          this.photoURL = res.data().photoURL;
          this.displayName = res.data().displayName;
        })
      })

    } else {
      this.photoURL = 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png';
      this.displayName = "Menu";
    }
  }
  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
  openPage(page) {

    this.nav.setRoot(page.component);
  }
  loguot() {
    this.storage.clear();
    localStorage.clear();
    this.signOut();
    this.nav.setRoot(LoginPage);
  }
  async setonline(online) {
    let uid = localStorage.getItem('uid');
    console.log(uid);
    this.afs.doc(`users/${uid}`).set({ online: online }, { merge: true })
  }
}
