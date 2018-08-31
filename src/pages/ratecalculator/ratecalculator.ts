import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,ToastController } from 'ionic-angular';

/**
 * Generated class for the RatecalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ratecalculator',
  templateUrl: 'ratecalculator.html',
})
export class RatecalculatorPage {
  datamatch;
  data;
  player;
  hostname;
  hostrate;
  league;
  matchid;
  rate;
  visitname;
  visitrate;
  selectteam;
  pushrate:number;
  color;
  money:number=50;
  summoney:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public viewCtrl: ViewController,) {
      
      let data:any;
      data =this.navParams.data.data;
      //this.datamatch=data.match;
    
  if(data.play=='host'){
  this.selectteam=data.match.hostname;
  this.pushrate=data.match.hostrate;
  }else{
    this.selectteam=data.match.visitname;
    this.pushrate=data.match.visitrate;
  }
  
     this. hostname=data.match.hostname;
     this. hostrate=data.match.hostrate;
     this. league=data.match.league;
     this. matchid=data.match.matchid;
     this. rate=data.match.rate;
     this. visitname=data.match.visitname;
     this. visitrate=data.match. visitrate;
  
  
  
      this.color=data.color;
      this.player=data.play;

      console.log(this.pushrate);
      this.summoney=(this.money*this.pushrate).toFixed(2);
  }

  moneychannel(x){
    console.log(x);
    
    this.summoney=(x*this.pushrate).toFixed(2);
  }
  ionViewDidEnter(){   
  }
  ionViewDidLoad() {   
  }
  dimm(){


    if(this.money<=49 || this.money>=1000) {
      let toast = this.toastCtrl.create({
        message: 'ตรวจสอบจำนวนเงิน',
        duration: 2000,
        position: "top"
      });
      toast.present();
    }else{
      let   data={
        name:'kim',last:'@kim'
         }
         this.viewCtrl.dismiss(data);
    }
  
  }
}
