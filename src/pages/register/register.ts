import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform ,ViewController,ToastController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { User } from '../../models/model';

import { Camera,CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

import { LoginPage } from '../../pages/login/login';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  @ViewChild('fileInput') fileInput;
  registerForm = {email:'',phoneNumber:'',displayName:'',password:'',confirmPassword:'',Type:true,time:null};
  private todo : FormGroup;
  user: Observable<User>;
  isReadyToSave: boolean;
  imageDataview:any;
  liba:any;
  image_Url_save:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform:Platform,
    private afAuth: AngularFireAuth,
    public camera: Camera,
    private toastCtrl: ToastController,
    public viewCtrl: ViewController,
    private DomSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore, ) {
     
      this.todo = this.formBuilder.group({
        profilePic: [''],
        email: ['', Validators.compose([Validators.required,  this.emailValidator])],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        phoneNumber: [''],
        displayName: ['', Validators.required],
        Type:['1']
      }, {validator: this.matchingPasswords('password', 'confirmPassword')})


      this.todo.valueChanges.subscribe((v) => {
        this.isReadyToSave = this.todo.valid;
      });
      this.user = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return of(null)
          }
        })
      )  
  }
  emailValidator(control: FormGroup): {[key: string]: any} {
    var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value && !emailRegexp.test(control.value)) {
      return { invalidEmail: true };
    }
  }
   matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
  
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  ionViewDidLoad() {
  //  console.log('ionViewDidLoad RegisterPage');
  }
  getPicture() {
   // console.log('คลิก---->');
    const options: CameraOptions = {
      quality: 80,
      sourceType:this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:true,
      targetWidth: 96,
      targetHeight: 96,
    } 
    if (Camera['installed']()) {
      console.log('ถ่ายรูป');
      this.camera.getPicture(options).then((data) => {
        this.todo.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
        console.log(data);
        this.imageDataview='data:image/jpg;base64,'+data;
      }, (err) => {
        console.log('select form allalum');
        
      return  this.camera.getPicture({
          sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE }).then((data) => {
         this.todo.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
        // this.todo.patchValue({ 'profilePic': data });
        // console.log(data);
          this.imageDataview='data:image/jpg;base64,'+data;
         
        })
      })
       
    } else {
     // console.log('เลือกจากเครื่อง');
      this.fileInput.nativeElement.click();
    }
   
  }
  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
     // console.log(readerEvent);
      let imageData = (readerEvent.target as any).result;
      this.todo.patchValue({ 'profilePic': imageData });
     // console.log(imageData);
      this.imageDataview=(imageData);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.todo.controls['profilePic'].value + ')'
  }
  async  register() {
    
    console.log(this.todo.value);
    let fillform = this.todo.value;
    const email=fillform.email;
    const password=fillform.password;
    const phoneNumber=fillform.phoneNumber;
    const photoURL=fillform.profilePic;
    const displayName=fillform.displayName;
  
    firebase.auth().createUserWithEmailAndPassword(email, password).then(response=>{
     // console.log(response); 
      let user = response.user;
      let userid = response.user.uid;
     // console.log(userid);
  if(userid){
    if(!this.imageDataview){
      let data = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        phoneNumber:phoneNumber,
        emailVerified:user.emailVerified
      }
      
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
       userRef.set(data, { merge: true });
       let toast = this.toastCtrl.create({
        message: 'ลงทะเบียนสำเร็จ',
        duration: 2000,
        position: "top"
      });
      toast.present();
      this.navCtrl.setRoot(LoginPage);
    }else{
      let storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`images/${response.user.uid}.jpg`);
      imageRef.putString(this.imageDataview, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
        imageRef.getDownloadURL().then(res=>{      
          this.image_Url_save =  res;
          console.log(res);
          let data = {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            phoneNumber:phoneNumber,
            photoURL:this.image_Url_save,
            emailVerified:user.emailVerified
          }
         // console.log(data);
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
           userRef.set(data, { merge: true });
           let toast = this.toastCtrl.create({
            message: 'ลงทะเบียนสำเร็จ',
            duration: 2000,
            position: "top"
          });
          toast.present();
          this.navCtrl.setRoot(LoginPage);
        })
      });
      
    }
  }
    }).catch(err=>{
      console.log('Error: ', err);
    })
}

  


}