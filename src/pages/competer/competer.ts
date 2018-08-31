import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import  firebase  from 'firebase/app';
/**
 * Generated class for the CompeterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-competer',
  templateUrl: 'competer.html',
})
export class CompeterPage {
  public Fire2:any;
  constructor(public navCtrl: NavController, 
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public navParams: NavParams) {

      var firedata;
 let  firedatashow=[];
 firebase.firestore()
  .collection("match").where("date", "==", "2018-08-30")
  .get()
  .then(querySnapshot=>{
    querySnapshot.forEach(doc=>{
      console.log(doc.id, " => ", doc.data());
      firedata={
        id:doc.id,
        date:doc.data().date,
        host:doc.data().host,
        hostrate:doc.data().hostrate,
        timecom:doc.data().timecom,
        visit:doc.data().visit,
        visitrate:doc.data().visitrate,
      };
      firedatashow.push(firedata) ;
    });
    this.Fire2=firedatashow;
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompeterPage');
  }

}
