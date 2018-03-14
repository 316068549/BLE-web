import { InMemoryDbService } from 'angular-in-memory-web-api';
import {endTimeRange, startTimeRange} from "@angular/core/src/profile/wtf_impl";
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let helpers = [
      {helperId: 1, helperName: '张三', address: '陕西省西安市雁塔区', sex: '女', age: 11, telephone: '13898966666',
        nationalId: '610126198908230733'},
      {helperId: 2, helperName: '张一', address: '陕西省西安市雁塔区', sex: '女', age: 11, telephone: '13898966666',
        nationalId: '610126198908230733'},
      {helperId: 3, helperName: '张无', address: '陕西省西安市雁塔区', sex: '女', age: 11, telephone: '13898966666',
        nationalId: '610126198908230733'},
      {helperId: 4, helperName: '张六', address: '陕西省西安市雁塔区', sex: '女', age: 11, telephone: '13898966666',
        nationalId: '610126198908230733'},
      {helperId: 5, helperName: '张四', address: '陕西省西安市雁塔区', sex: '女', age: 11, telephone: '13898966666',
        nationalId: '610126198908230733'}
    ];
    return {helpers};
  }
}

