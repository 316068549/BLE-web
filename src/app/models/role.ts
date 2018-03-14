import { User } from '../models/user-model';
import { Menu } from '../models/menu';
export class Role {
  roleId: number;
  roleName: string;
  roleDescription: string;
  selected:boolean;
  status: boolean;
  createTime:number;
  permissionList: Array<Menu>;
  userListserList: Array<User>;

}
