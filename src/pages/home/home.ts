import { Component } from '@angular/core';
import { NavController ,Modal, ModalController,PopoverController} from 'ionic-angular';
import { Storage } from "@ionic/storage";
import {LoginPage} from '../login/login';
import {RatecalculatorPage} from '../ratecalculator/ratecalculator';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import  firebase  from 'firebase/app';
import  {FireserviceProvider} from '../../providers/fireservice/fireservice';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  {
user:any;
public Fire2:any;
  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private modal: ModalController,
    public popoverCtrl: PopoverController,
    public fservice :FireserviceProvider,
    public storage: Storage) {
     this.user= localStorage.getItem('user');
      console.log(this.user);
      var firedata;
      let  firedatashow=[];
        /*
 firebase.firestore().collection("/match/TonFc/competition/")
 .orderBy("timecom", "asc").onSnapshot(snapshot=>{
      snapshot.docChanges().forEach(change=>{

        if (change.type === "added") {
      //    console.log("New city: ", change.doc.data());
          firedata={
            id:change.doc.id,
            date:change.doc.data().date,
            host:change.doc.data().host,
            hostname:change.doc.data().hostname,
            hostrate:change.doc.data().hostrate,
            timecom:change.doc.data().timecom,
            visit:change.doc.data().visit,
            visitname:change.doc.data().visitname,
            visitrate:change.doc.data().visitrate,
            rate:change.doc.data().rate,
            league:change.doc.data().league,
            matchid:change.doc.data().matchid,
          };
          firedatashow.push(firedata) ;
      }
    
      if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
          firedata={
            id:change.doc.id,
            date:change.doc.data().date,
            host:change.doc.data().host,
            hostname:change.doc.data().hostname,
            hostrate:change.doc.data().hostrate,
            timecom:change.doc.data().timecom,
            visit:change.doc.data().visit,
            visitname:change.doc.data().visitname,
            visitrate:change.doc.data().visitrate,
            rate:change.doc.data().rate,
            league:change.doc.data().league,
            matchid:change.doc.data().matchid,
          };
          firedatashow.push(firedata) ;
      }
      if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
          firedata={
            id:change.doc.id,
            date:change.doc.data().date,
            host:change.doc.data().host,
            hostname:change.doc.data().hostname,
            hostrate:change.doc.data().hostrate,
            timecom:change.doc.data().timecom,
            visit:change.doc.data().visit,
            visitname:change.doc.data().visitname,
            visitrate:change.doc.data().visitrate,
            rate:change.doc.data().rate,
            league:change.doc.data().league,
            matchid:change.doc.data().matchid,
          };
          firedatashow.push(firedata) ;
      }
     
      })  
      this.Fire2=firedatashow;  
    }) 
     */
   this.fservice.getmatch().onSnapshot(snapshot=>{
    snapshot.docChanges().forEach(change=>{
      if (change.type === "added") {
        //    console.log("New city: ", change.doc.data());
            firedata={
              id:change.doc.id,
              date:change.doc.data().date,
              host:change.doc.data().host,
              hostname:change.doc.data().hostname,
              hostrate:change.doc.data().hostrate,
              timecom:change.doc.data().timecom,
              visit:change.doc.data().visit,
              visitname:change.doc.data().visitname,
              visitrate:change.doc.data().visitrate,
              rate:change.doc.data().rate,
              league:change.doc.data().league,
              matchid:change.doc.data().matchid,
            };
            firedatashow.push(firedata) ;
        }
    })
    this.Fire2=firedatashow;  
    })
  
  }
  ngOnInit() {
    if(!localStorage.getItem('user')){
      this.navCtrl.setRoot(LoginPage);
    }
    
  }
  clickhost(m,w,c){
    console.log(m,w,c);
  let   data={
    match:m,play:w,color:c
  }
    const myModal: Modal = this.modal.create(RatecalculatorPage, { data: data});
    myModal.present();
  }
  
}
