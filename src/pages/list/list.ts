import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  selectedSection;
  title;
  lot2t: any = {};
  lot2tsave: any = [];
  lot3t: any = {};
  lotpt: any = {};
  grandtotal: number = 0;
  private todo: FormGroup;
  private todos: FormGroup;
  items: Array<{ title: string, note: string, icon: string }>;
  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
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
      numtxt1:[''],
      numtxt2:[''],
      numtxt3:[''],
      numtxt4:[''],
      numtxt5:[''],
    })
    
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
    if(data.numtxt!==undefined && data.numtxt.length ===2 && data.money !==undefined && data.money !==null && data.money >= 10 ){   
    if (data.bon === true) {
      console.log('บน');
      this.lot2tsave.push({
        numtxt: data.numtxt, whatpay:'บน', topic:'bon', money: data.money
      });
      
      if (data.tod === true) {
        var str = data.numtxt;

        var splitted = str.split("");
        console.log(splitted)
        const newtod = splitted[1] + splitted[0];
        this.lot2tsave.push({
          numtxt: newtod, whatpay:'โต้ดบน', topic:'ttod', money: data.money
        });
        
      }
     
    }
    if (data.lang === true) {
      console.log('ล่าง');
      this.lot2tsave.push({
        numtxt: data.numtxt, whatpay:'ล่าง',  topic:'lang' ,money: data.money
      });
      if (data.tod === true) {
        var str2 = data.numtxt;

        var splitted2 = str2.split("");
        console.log(splitted2)
        const newtod2 = splitted2[1] + splitted2[0];
        this.lot2tsave.push({
          numtxt: newtod2, whatpay:'โต้ดล่าง', topic:'ltod',money: data.money
        });
      }
    }

    console.log(this.lot2tsave);
    this.grandtotal=this.getSum(this.lot2tsave);
    }else{
      let toast = this.toastCtrl.create({
        message: 'ตรวจสอบตัวเลข',
        duration: 2000,
        position: "top"
      });
      toast.present();
    }
    
  }

  getSum(arr:any) : number {
    let sum = 0;
    for(let i = 0; i < arr.length; i++) {   
      sum += arr[i]['money'];
    }
    return sum;
  }
  addlot3t(x) { 
      let data = this.todo.value;
      console.log(data);
     if(data.numtxt!==undefined && data.numtxt.length ===3 && data.money !==undefined && data.money !==null && data.money >= 10){
     
      this.lot2tsave.push({
        numtxt: data.numtxt, whatpay:'เต็ง',topic:'teng', money: data.money
      });
      if (data.tod3 === true) {
        console.log('บน');
        this.lot2tsave.push({
          numtxt: data.numtxt, whatpay:'โต๊ด',topic:'tod3', money: data.money
        });
      
  }
  this.grandtotal=this.getSum(this.lot2tsave);
     }else{
      let toast = this.toastCtrl.create({
        message: 'ตรวจสอบตัวเลข',
        duration: 2000,
        position: "top"
      });
      toast.present();
     }
      
  }
  addlotpt(x) {
    let data = this.todo.value;
    if(data.money !==undefined && data.money !==null  && data.numtxt1!==undefined  && 
      data.numtxt2!==undefined  && data.numtxt3!==undefined  && 
      data.numtxt4!==undefined  && data.numtxt5!==undefined  && data.money >= 10){  
    console.log(x);
    let data = this.todo.value;
    console.log(data);
    let numseries=data.numtxt1+','+data.numtxt2+','+data.numtxt3+','+data.numtxt4+','+data.numtxt5;
    this.lot2tsave.push({
      numtxt: numseries, whatpay:'หวยพวง',topic:'series',money: data.money
    });
    this.grandtotal=this.getSum(this.lot2tsave);

  }else{
    let toast = this.toastCtrl.create({
      message: 'ตรวจสอบตัวเลข',
      duration: 2000,
      position: "top"
    });
    toast.present();
  }
  }
  itemTapped(event, item) {
    console.log(event, item);
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
