import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-rescuepapers',
  templateUrl: './rescuepapers.component.html',
  styleUrls: ['./rescuepapers.component.css']
})
export class RescuepapersComponent implements OnInit {

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

