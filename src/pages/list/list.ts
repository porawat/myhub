import { ViewChild, Component, Renderer } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FireserviceProvider } from '../../providers/fireservice/fireservice';
import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @ViewChild('input') input;
  selectedItem: any;
  icons: string[];
  selectedSection;
  title;
  lot2t: any = {};
  lot2tsave: any = [];
  lot3t: any = {};
  lotpt: any = {};
  canpay;
  myhdorder;
  tokenName:any;
  tokenValue:number;
  public uid: any;
  grandtotal: number = 0;
  grandhdtotal: number = 0;
  interest:number;
  private todo: FormGroup;
  items: Array<{ title: string, note: string, icon: string }>;
  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    public platform: Platform,
    public fbservice: FireserviceProvider,
    private renderer: Renderer,
    public storage: Storage,
    public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedSection = "tabOne";
    this.title = "ซื้อเลข 2 ตัว";
    this.todo = this.formBuilder.group({
      numtxt: ['', Validators.required],
      money: ['', Validators.required],
      lang: [false],
      tod: [false],
      tod3: [false],
      teng: [false],
      bon: [false],
      numtxt1: [''],
      numtxt2: [''],
      numtxt3: [''],
      numtxt4: [''],
      numtxt5: [''],
    })
    this.canpay = this.lot2tsave.length;
    this.myCredit();
  }
  myCredit(){
    let uid = localStorage.getItem('uid');
    const cd =  this.db.firestore.collection('/match/TonFc/token').doc(uid);
console.log(cd);

  cd.onSnapshot(snap=>{
    console.log('==>',snap.data());
    this.tokenName=snap.data().tokenName;
    this.tokenValue=snap.data().tokenValue
    this.interest=snap.data().interest;
  })
  
  }
  getpaythaihd() {
    var thaihddata;
    let thaihddatashow = [];
    let uid = localStorage.getItem('uid');
    console.log(uid);
    this.fbservice.getmatch("/match/TonFc/THAIHD/").where("uid", "==", uid).where("orderstatus", "==", "wait").onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          console.log(change.doc.data());
          thaihddata = {
            hdid: change.doc.data().hdid,
            ngud: change.doc.data().ngud,
            ngudlabel: change.doc.data().ngudlabel,
            order: change.doc.data().order,
            payvalue: change.doc.data().payvalue,
            orderstatus: change.doc.data().orderstatus,
          };
          thaihddatashow.push(thaihddata);
        }
      })
      console.log(thaihddatashow);
      this.myhdorder = thaihddatashow;
      this.grandhdtotal = this.getSumhd(thaihddatashow);
    })
  }
  getSumhd(arr: any): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]['payvalue'];
    }
    return sum;
  }
  async ionViewDidEnter() {
    console.log('1');
    this.getpaythaihd();
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

  showtab() {
    console.log(this.selectedSection);
    if (this.selectedSection == 'tabOne') {
      this.title = "ซื้อเลข 2 ตัว";
    } else if (this.selectedSection == 'tabTwo') {
      this.title = "ซื้อเลข 3 ตัว ";
    } else {
      this.title = "ซื้อเลข พวง";
    }
  }
  addlot2t(x) {
    let data = this.todo.value;
    console.log(data);
    if (data.numtxt !== undefined && data.numtxt.length === 2 && data.money !== undefined && data.money !== null && data.money >= 10) {
      if (data.bon === true) {
        console.log('บน');
        this.lot2tsave.push({
          numtxt: data.numtxt, whatpay: 'บน', topic: 'bon', money: data.money
        });

        if (data.tod === true) {
          var str = data.numtxt;

          var splitted = str.split("");
          console.log(splitted)
          const newtod = splitted[1] + splitted[0];
          this.lot2tsave.push({
            numtxt: newtod, whatpay: 'โต้ดบน', topic: 'ttod', money: data.money
          });

        }

      }
      if (data.lang === true) {
        console.log('ล่าง');
        this.lot2tsave.push({
          numtxt: data.numtxt, whatpay: 'ล่าง', topic: 'lang', money: data.money
        });
        if (data.tod === true) {
          var str2 = data.numtxt;

          var splitted2 = str2.split("");
          console.log(splitted2)
          const newtod2 = splitted2[1] + splitted2[0];
          this.lot2tsave.push({
            numtxt: newtod2, whatpay: 'โต้ดล่าง', topic: 'ltod', money: data.money
          });
        }
      }

      console.log(this.lot2tsave);
      this.grandtotal = this.getSum(this.lot2tsave);
    } else {
      let toast = this.toastCtrl.create({
        message: 'ตรวจสอบตัวเลข',
        duration: 2000,
        position: "top"
      });
      toast.present();
    }
    this.canpay = this.lot2tsave.length;
  }

  getSum(arr: any): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]['money'];
    }
    return sum;
  }
  addlot3t(x) {
    let data = this.todo.value;
    console.log(data);
    if (data.numtxt !== undefined && data.numtxt.length === 3 && data.money !== undefined && data.money !== null && data.money >= 10) {

      this.lot2tsave.push({
        numtxt: data.numtxt, whatpay: 'เต็ง', topic: 'teng', money: data.money
      });
      if (data.tod3 === true) {
        console.log('บน');
        this.lot2tsave.push({
          numtxt: data.numtxt, whatpay: 'โต๊ด', topic: 'tod3', money: data.money
        });

      }
      this.grandtotal = this.getSum(this.lot2tsave);
    } else {
      let toast = this.toastCtrl.create({
        message: 'ตรวจสอบตัวเลข',
        duration: 2000,
        position: "top"
      });
      toast.present();
    }
    this.canpay = this.lot2tsave.length;
  }
  addlotpt(x) {
    let data = this.todo.value;
    if (data.money !== undefined && data.money !== null && data.numtxt1 !== undefined &&
      data.numtxt2 !== undefined && data.numtxt3 !== undefined &&
      data.numtxt4 !== undefined && data.numtxt5 !== undefined && data.money >= 10) {
      console.log(x);
      let data = this.todo.value;
      console.log(data);
      let numseries = data.numtxt1 + ',' + data.numtxt2 + ',' + data.numtxt3 + ',' + data.numtxt4 + ',' + data.numtxt5;
      this.lot2tsave.push({
        numtxt: numseries, whatpay: 'หวยพวง', topic: 'series', money: data.money
      });
      this.grandtotal = this.getSum(this.lot2tsave);

    } else {
      let toast = this.toastCtrl.create({
        message: 'ตรวจสอบตัวเลข',
        duration: 2000,
        position: "top"
      });
      toast.present();
    }
    this.canpay = this.lot2tsave.length;
  }
  itemTapped(event, item) {
    console.log(event, item);
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
  async  payorder() {
    this.grandtotal;// ราคารวม
    this.interest;
    this.tokenValue;
    let buy = this.grandtotal-(this.grandtotal*this.interest);
    let upmycd:number=this.tokenValue-buy;
    console.log(buy)
    if(buy<=this.tokenValue){
      console.log('ซื้อได้');
      const hdid = "PH" + Date.now().toString();
      let uid = localStorage.getItem('uid');
      console.log(uid, this.lot2tsave);     
      let datatosave = {
        hdid: hdid,
        uid: uid,
        ngud: '2018-09-16',
        ngudlabel: '16 กันยายน 2561',
        timestamp: Date.now(),
        order: this.lot2tsave,
        orderstatus: 'wait',
        payvalue: buy
      }
      var newmatch = this.db.collection('/match/TonFc/THAIHD').doc(hdid);
      newmatch.set(datatosave);
      var docRef = this.db.collection('/match/TonFc/token/').doc(uid);
      var updateTimestamp = docRef.update({tokenValue: upmycd});
      this.lot2tsave = [];
      this.canpay = 0;

    }else{
      let toast = this.toastCtrl.create({
        message: 'เงินไม่เพียงพอ กรุณาเติมเงินก่อน',
        duration: 2000,
        position: "top"
      });
      toast.present();
    }
   
  }
  
}
