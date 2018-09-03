import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, PopoverController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from "@ionic/storage";
import { RatecalculatorPage } from '../ratecalculator/ratecalculator';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as  firebase from 'firebase/app';
import { FireserviceProvider } from '../../providers/fireservice/fireservice';
/**
 * Generated class for the PlaystepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-playstep',
  templateUrl: 'playstep.html',
})
export class PlaystepPage {
  user: any;
  public Fire2: any;
  listdatashow = [];
  temptableshow: boolean = false;
  constructor(public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private modal: ModalController,
    public popoverCtrl: PopoverController,
    public fbservice: FireserviceProvider,
    public storage: Storage,
    public navParams: NavParams) {
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
    this.user = localStorage.getItem('user');
    console.log(this.user);

  }
  ngOnInit() {
    if (!localStorage.getItem('user')) {
      this.navCtrl.setRoot(LoginPage);
    }
    this.temptableshow = false;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaystepPage');
  }
  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }
  clickhost(m, w, c) {
    var hostteam = this.findObjectByKey(this.listdatashow, 'id', m.id);
    console.log(m, w, c);
    if (!hostteam) { this.listdatashow.push(m) };
    console.log(this.listdatashow.length);
    if (this.listdatashow.length > 0) {
      this.temptableshow = true;
    }

    /*
  let   data={
    match:m,play:w,color:c
  }
    const myModal: Modal = this.modal.create(RatecalculatorPage, { data: data});
    myModal.present();

    myModal.onDidDismiss((data) => { //ปิดแล้ว

      console.log(data);
      console.log('1');
     
    })
    myModal.onWillDismiss((data) => { //กำลังจะปิด
      
      console.log(data);
      console.log('2');
    })
*/
  }

}
