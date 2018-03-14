import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  constructor(
    private router: Router,
    private location: Location) {
  }
  ngOnInit() {
  }


  goBack(): void {
    this.location.back();
  }

}

