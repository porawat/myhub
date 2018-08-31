import { Component,OnInit ,Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {MyDatePickerModule} from 'mydatepicker';
import {IMyDpOptions} from 'mydatepicker';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, publish } from 'rxjs/operators';
import  firebase  from 'firebase/app';

/**
 * Generated class for the CompetitionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Pipe({
  name: 'newsfilter'
})
@IonicPage()
@Component({
  selector: 'page-competition',
  templateUrl: 'competition.html',
})
export class CompetitionPage implements OnInit {
  transform(array: any[]) {        
    if (!array) return;      
    console.log(array.length);     
}
  registerForm = {host:'',visit:'',timecom:'',rate:'',daycom:'',hostrate:'',visitrate:'',league:'L01'};
  isReadyToSave: boolean;
  datashow=[];
  newadd={};
  datatosave;
public  selectleague:any;
public Fire2:any;
hostteam;
visitteam;
 
  private todo : FormGroup;
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
};

// Initialized to specific date (09.10.2018).
public model: any = { date: { year: 2018, month: 10, day: 9 } };
  constructor(
    public navCtrl: NavController, 
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    //public fs : firebase,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore, ) {

    this.todo = this.formBuilder.group({
      host: ['',Validators.required],
      visit: ['', Validators.required],
      daycom: ['', Validators.required],
      timecom: ['', Validators.required],
      rate: ['',Validators.required],
      visitrate:['',Validators.required],
      hostrate:['',Validators.required], 
      league:['L01',Validators.required],
      
    })

    this.todo.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.todo.valid;
    });
    
  }
  ngOnInit(){
    var leagueobj;
    let  leagu2sel=[];
    firebase.firestore().collection("/match/TonFc/League/")
 .orderBy("Lid", "asc").onSnapshot(snapshot=>{
      snapshot.docChanges().forEach(change=>{
        
        leagueobj={
          League_id:change.doc.id,
          Lid:change.doc.data().Lid,
          Name:change.doc.data().Name,
          country:change.doc.data().country,
          team:change.doc.data().team
        };
        leagu2sel.push(leagueobj) ;
      })
      this.selectleague=leagu2sel; 
      this.hostteam=leagu2sel[0].team;
      console.log(this.hostteam);
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CompetitionPage');
  }
  myhost(){
   const x:string = this.todo.value.host;
  // let vteam = this.hostteam;
  //   //this.visitteam=hostteam;
  //   vteam.forEach( (id, index) => {
  //     console.log(x,id,index);
  //    if(id.id === x) vteam.splice(index,1);
  //   });
   
  //  this.visitteam=vteam;
  }
  myleague(x){
    var leagueobj;
    let  leagu2sel=[];
    console.log('เลือก ลีก'+ x + "==>"+this.registerForm.league);
    firebase.firestore().collection("/match/TonFc/League/").where("Lid","==",x)
    .onSnapshot(snapshot=>{
         snapshot.docChanges().forEach(change=>{
           
           leagueobj={
             League_id:change.doc.id,
             Lid:change.doc.data().Lid,
             Name:change.doc.data().Name,
             country:change.doc.data().country,
             team:change.doc.data().team
           };
           leagu2sel.push(leagueobj) ;
         })
        // this.selectleague=leagu2sel; 
         this.hostteam=leagu2sel[0].team;
         console.log(this.hostteam);
       })
  }
  
  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

test(){
 
  
}
  savecomp(){
const matchid="T"+Date.now().toString();

    let valto = this.todo.value; 
    let matchday=valto.daycom.formatted;  
    var hostteam = this.findObjectByKey(this.hostteam, 'id', valto.host);
    var visitteam = this.findObjectByKey(this.hostteam, 'id', valto.visit);
    this.datatosave = {
      date:matchday,
      timecom:valto.timecom,
      host:valto.host,
      hostname:hostteam.name,
      hostrate:valto.hostrate,
      visit:valto.visit,
      visitname:visitteam.name,
      visitrate:valto.visitrate,
      rate:valto.rate, 
      league: valto.league,
      matchid:matchid,
      timestamp:Date.now()
     }
   
     this.datashow.push(this.datatosave);
    console.log(this.datashow);
     var newmatch = firebase.firestore().collection('/match/TonFc/competition/').doc(matchid);
         newmatch.set(this.datatosave);
         

         this.todo.value.rate='';
         this.todo.value.hostrate='';
         this.todo.value.visitrate='';
        
  }
 savematch(){
 var firedata;
 let  firedatashow=[];
 firebase.firestore()
  .collection("match/TonFc").where("date", "==", "2018-08-30")
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
        rate:doc.data().rate,
      };
      firedatashow.push(firedata) ;
    });
    this.Fire2=firedatashow;
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
  
 }

}

