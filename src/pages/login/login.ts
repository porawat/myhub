import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, Loading, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';
import { firestore } from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Sim } from '@ionic-native/sim';
import { User } from '../../models/model';
import { HomePage } from '../../pages/home/home';
import { RegisterPage } from '../../pages/register/register';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm = { email: '', password: '' };
  todo: FormGroup;
  isApp;
  loading: Loading;
  user: Observable<User>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public platform: Platform,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private afs: AngularFirestore,
    private toastCtrl: ToastController,
    private sim: Sim,
    private fb: Facebook,
    public storage: Storage) {
    this.todo = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  loginUser() {
    this.showLoading();
    console.log(this.todo.value);
    const email = this.todo.value.email;
    const password = this.todo.value.password;
    firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
      console.log(response);
      let user = response.user;
      let data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified
      }
      console.log(user);
      this.updateUserData(data);

      localStorage.setItem('user', JSON.stringify(data));
      this.storage.set('user', data);

      this.afs.doc(`users/${user.uid}`).set(data, { merge: true })
      this.closeLoading();
      this.navCtrl.setRoot(HomePage);
    })
      .catch(err => {
        console.log(err);
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 2000,
          position: "top"
        });
        toast.present();   //  myLoader.dismiss();
      });
  }
  register() {
    this.navCtrl.setRoot(RegisterPage);
  }
  signInPhonenumber() {

  }
  signInWithGoogle(): Promise<any> {
    return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }
  signInWithFacebook(): Promise<any> {
    return this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
  }
  private oauthSignIn(provider: AuthProvider) {
    this.showLoading();
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider).then(result => {
        let user = result.user;
        this.updateUserData(user);
        this.navCtrl.setRoot(HomePage);
      });
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(() => {
          return this.afAuth.auth.getRedirectResult().then(result => {
            let user = result.user;
            console.log(user);
            this.updateUserData(user);
            this.closeLoading();
            this.navCtrl.setRoot(HomePage);
          }).catch(function (error) {
            // Handle Errors here.
            this.closeLoading();
            alert(error.message);
          });
        });
    }
  }
  private updateUserData(user) {
    // Sets user data to firestore on login 
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified
    }

    this.storage.set("user", data);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('uid', user.uid);
    localStorage.setItem('email', user.email);
    localStorage.setItem('displayName', user.displayName);
    localStorage.setItem('photoURL', user.photoURL);

    return userRef.set(data, { merge: true })
  }
  doFacebookLogin(): Promise<any> {
    return this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then(user => {
            let data = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              phoneNumber: user.phoneNumber,
              gzonCredit: 1000,
              tonfcCredit: 1000
            }
            this.updateUserData(data);
            this.closeLoading();
            this.navCtrl.setRoot(HomePage);
            console.log(data);
          });
      }).catch((error) => {
        console.log(error)
        this.closeLoading();
      });
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true,
    })
    this.loading.present();
  }
  closeLoading() {
    setTimeout(() => {
      this.loading.dismiss();
    }, 1000);
    //  toast.dismiss();
  }
}
