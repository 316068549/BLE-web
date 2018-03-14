import { OnInit,Component, Input,Output, EventEmitter } from '@angular/core';
import { Router }            from '@angular/router';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { MenuService} from '../../shared-service/menu-service';
import { Menu } from '../../models/menu';
declare var layer: any;

@Component({
  selector: 'menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.css']
})
export class MenuSearchComponent implements OnInit {
  @Input()
  data:  boolean;

  @Output()
  change = new EventEmitter<boolean>();
  voted = false;

  menus: Menu[];
  // private searchTerms = new Subject<string>();
  constructor(
    private menuSearchService: MenuService,
    private router: Router) {}
  // search(term: string): void {
  //   this.searchTerms.next(term);
  // }

  search2(term: string): void{
    this.menuSearchService.search(term).then( menus => {
      if(!menus['data']['list']){
        this.voted = false;
      }
      if(menus['data']['list']==0){
        this.voted = false;
      }
      if(menus['data']['list'].length>0){
        this.menus = menus['data']['list'];
        this.voted = true;
      }
      console.log(this.menus);
      this.change.emit(this.voted);
    });
  }
  ngOnInit(): void {
    // this.menus = this.searchTerms
    //   .debounceTime(300)        // wait 300ms after each keystroke before considering the term
    //   .distinctUntilChanged()   // ignore if next search term is same as previous
    //   .switchMap(term => term   // switch to new observable each time the term changes
    //     // return the http search observable
    //     ? this.menuSearchService.search(term)
    //     // or the observable of empty heroes if there was no search term
    //     : Observable.of<Menu[]>([]))
    //   .catch(error => {
    //     // TODO: add real error handling
    //     console.log(error);
    //     return Observable.of<Menu[]>([]);
    //   });
    // console.log(this.menus);
  }
  gotoDetail(menu: Menu): void {
    let link = ['home/menu/detail',menu.permissionId];
    this.router.navigate(link);
  }

}

