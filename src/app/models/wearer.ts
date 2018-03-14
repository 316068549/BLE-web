import {familyPhone} from './family-phone';
export class Wearer {
  oldManId:string;
  deviceIMEI: string;
  // imageUrl: File;
  surname: string;
  name:string;
  age:number;
  sex:number;
  phone:string;
  address:string;
  phone1?:string;
  phone2?:string;
  phone3?:string;
  phone4?:string;
  phone5?:string;
  familyPhones:Array<familyPhone>;
}
