import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-rescue-organization',
  templateUrl: './rescue-organization.component.html',
  styleUrls: ['./rescue-organization.component.css']
})
export class RescueOrganizationComponent implements OnInit {

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

