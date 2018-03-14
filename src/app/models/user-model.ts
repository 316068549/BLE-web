import { Role } from '../models/role';
  export class User {
  userId: number;
  userName: string;
  nickName: string;
  userPassword:string;
  createTime:number;
  userStatus:boolean;
  departmentId:number;
  // rescueTeamId:string;
  roleList:Array<Role>;
  mobile:string;
}

