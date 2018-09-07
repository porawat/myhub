import { Component, OnInit } from '@angular/core';
import { NavController, Platform, Modal, ModalController, PopoverController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login';
import { RatecalculatorPage } from '../ratecalculator/ratecalculator';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import firebase from 'firebase/app';
import { FireserviceProvider } from '../../providers/fireservice/fireservice';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  user: any;
  public Fire2: any;
  IMEI;
  public userid;
  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private modal: ModalController,
    public platform: Platform,
    public popoverCtrl: PopoverController,
    public fbservice: FireserviceProvider,
    private androidPermissions: AndroidPermissions,
    public storage: Storage) {
    var firedata;
    let firedatashow = [];
    this.fbservice.getmatch("/match/TonFc/competition/").orderBy("timecom", "asc").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          //    console.log("New city: ", change.doc.data());
          firedata = {
            id: change.doc.id,
            date: change.doc.data().date,
            host: change.doc.data().host,
            hostname: change.doc.data().hostname,
            hostrate: change.doc.data().hostrate,
            timecom: change.doc.data().timecom,
            visit: change.doc.data().visit,
            visitname: change.doc.data().visitname,
            visitrate: change.doc.data().visitrate,
            rate: change.doc.data().rate,
            league: change.doc.data().league,
            matchid: change.doc.data().matchid,
          };
          firedatashow.push(firedata);
        }
      })
      this.Fire2 = firedatashow;
    })
  }
  ngOnInit() {
    if (!localStorage.getItem('user')) {
      this.navCtrl.setRoot(LoginPage);
    } else {
      this.platform.ready().then(() => {
      this.platform.pause.subscribe((result) => {
        console.log(result);
        let online = false;
        this.setonline(online);
      })
      this.platform.resume.subscribe((result) => {
        console.log(result);
        let online = true;
        this.setonline(online);
      })
    })
    }
    // if (this.platform.is('android')) {
    //   this.androidPermissions.requestPermissions(
    //     [
    //       this.androidPermissions.PERMISSION.CAMERA, 
    //       this.androidPermissions.PERMISSION.CALL_PHONE, 
    //       this.androidPermissions.PERMISSION.GET_ACCOUNTS, 
    //       this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
    //       this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    //       this.androidPermissions.PERMISSION.READ_PHONE_STATE
    //     ]
    //   );

    // }else{
    //   console.log(this.platform);
    // }

  }
  async setonline(online) {
    let uid = localStorage.getItem('uid');
    
    this.afs.doc(`users/${uid}`).set({online: online }, { merge: true })
  }
  async ionViewDidEnter() {
    console.log('1');
    if (this.platform.is('android')) {
      let user = await this.storage.get("user");
      if (!user) {
        this.navCtrl.setRoot(LoginPage);
      }
    } else {
      if (!localStorage.getItem('user')) {
        this.navCtrl.setRoot(LoginPage);
      }
    }
  }
  ionViewWillEnter() {
    console.log('2');
  }
  async ionViewDidLoad() {
    console.log('3');
    if (this.platform.is('android')) {
      let user = await this.storage.get("user");
      if (!user) {
        this.navCtrl.setRoot(LoginPage);
      }
    } else {
      if (!localStorage.getItem('user')) {
        this.navCtrl.setRoot(LoginPage);
      }
    }


  }

  clickhost(m, w, c) {
    console.log(m, w, c);
    let data = {
      match: m, play: w, color: c
    }
    const myModal: Modal = this.modal.create(RatecalculatorPage, { data: data });
    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log(data);
      console.log('1');
      //this.signature1 = data.signature;
    })
    myModal.onWillDismiss((data) => {
      console.log('2');
      console.log(data);
    })
  }

}

