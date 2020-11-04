import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  animations: [
    trigger('fadeInOut', [
      state('initial', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(400 )
      ]),
      transition(':leave',
        animate(400, style({opacity: 0})))
    ])
  ]
})

export class ErrorHandlingComponent implements OnInit {

  errorText = ['This is an Error'];
  errorActive = false;

  constructor() { }

  ngOnInit(): void {
  }

  setError(errorText: string): void{
    this.errorText = [errorText];
    this.errorActive = true;
    setTimeout(() => { this.errorActive = false; }, 4000);
  }

}
