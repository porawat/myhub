import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform ,ViewController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase/app';
import { firestore } from 'firebase';
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from 'angularfire2/auth';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { User } from '../../models/model';

import { Camera,CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

import { HomePage } from '../../pages/home/home';
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
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform:Platform,
    private afAuth: AngularFireAuth,
    public camera: Camera,
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
    console.log('ionViewDidLoad RegisterPage');
  }
  upload(image) {
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);

    imageRef.putString(image, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      imageRef.getDownloadURL().then(res=>{
        console.log(res);
      })
    });
    
  }
  getPicture() {
    console.log('คลิก---->');
    const options: CameraOptions = {
      quality: 60,
      //destinationType: this.camera.DestinationType.FILE_URI,//call file
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
     // sourceType:this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum:true,
      targetWidth: 48,
      targetHeight: 48
    } 
    if (Camera['installed']()) {
      console.log('ถ่ายรูป');
      this.camera.getPicture(options).then((data) => {
        this.todo.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
        console.log(data);
        this.imageDataview=(data);
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
          this.upload(this.imageDataview);
        })
      })
       
    } else {
      console.log('เลือกจากเครื่อง');
      this.fileInput.nativeElement.click();
    }
   
  }
  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      console.log(readerEvent);
      let imageData = (readerEvent.target as any).result;
      this.todo.patchValue({ 'profilePic': imageData });
      console.log(imageData);
      this.imageDataview=(imageData);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.todo.controls['profilePic'].value + ')'
  }
  register(){
    console.log(this.todo.value);
    let fillform = this.todo.value;
    const email=fillform.email;
    const password=fillform.password;
    const phoneNumber=fillform.phoneNumber;
    const photoURL=fillform.profilePic;
    const displayName=fillform.displayName;
    //const Type=fillform.Type;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(response=>{
      console.log(response); 
      let user = response.user;
      let userid = response.user.uid;
      console.log(userid);
  if(userid){
    let data = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: photoURL,
      phoneNumber:phoneNumber,
      emailVerified:user.emailVerified
    }
    console.log(data);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.set(data, { merge: true });
  }
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }
}
