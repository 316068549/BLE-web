import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionComponent implements OnInit {

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

