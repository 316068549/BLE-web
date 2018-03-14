import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params,Router, ParamMap } from '@angular/router';
import { GaodeMapComponent } from './gaode-map/gaode-map.component';

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.css']
})
export class TrackDetailComponent implements OnInit {
  imeiCode:number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.imeiCode = this.route.snapshot.params['deviceIMEI'];
  }

}


