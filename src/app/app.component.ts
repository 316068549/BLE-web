import { Component, HostListener, ElementRef, Renderer, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/merge';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(

  ) {

  }

  public ngAfterViewInit():void{
    let ak = document.getElementById('nb-global-spinner');
    ak.style['display'] = 'none';
  }



}

