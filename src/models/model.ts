import { Timestamp } from "rxjs";
import { DateTime } from "ionic-angular";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber:string;
  }
  
  export interface Chat {
    message: string;
    pair: string;
    sender: string;
    time: number;
  }
  export interface ThaiHD {
    hdid: string;
    uid: string;
    ngud: string;
    ngudlabel:string
    timestamp:number,
    order:any,
    orderstatus:string,
    payvalue:number

  }
  