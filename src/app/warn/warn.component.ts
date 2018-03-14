import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-warn',
  templateUrl: './warn.component.html',
  styleUrls: ['./warn.component.css']
})
export class WarnComponent implements OnInit {

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

