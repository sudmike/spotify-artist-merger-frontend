import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParameters => {
      if (queryParameters.code) {
        // insert spotify activation
      }
    });
  }

}
