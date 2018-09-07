import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { User, Chat } from "../../models/model";
import { Firebase_Config } from '../../app/app.firebase';
import firebase from 'firebase/app';
import { Storage } from "@ionic/storage";
import { AndroidPermissions } from '@ionic-native/android-permissions';
@Injectable()
export class FireserviceProvider {
  uid;
  datalist;
  users: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;

  chats: AngularFirestoreCollection<Chat>;
  private chatDoc: AngularFirestoreDocument<Chat>;
  constructor(private db: AngularFirestore,
    public storage: Storage,
    private afs: AngularFirestore,
    private androidPermissions: AndroidPermissions, ) {

    this.users = this.db.collection<User>(Firebase_Config.users_endpoint);
    this.chats = this.db.collection<Chat>(Firebase_Config.chats_endpoint);
  }
  addUser(payload) {
    return this.users.add(payload);
  } //addUser

  getmatch(part) {
    return firebase.firestore().collection(part);
  }
  getUid() {
    return localStorage.getItem('uid');
  }
  async  getuserinfo(uid) {
    return await this.afs.firestore.collection('users/').doc(uid);
  }
  async getImei() {
    const hasPermission = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
      return;
    }
    return this.uid.IMEI;
  }
  async getuser() {
    return await this.storage.get("user");
  }
  getCredit() {
    return 1000;
  }
}