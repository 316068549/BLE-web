import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

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

