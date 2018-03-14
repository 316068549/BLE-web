import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-wearer',
  templateUrl: './wearer.component.html',
  styleUrls: ['./wearer.component.css']
})
export class WearerComponent implements OnInit {

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

