import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
})

export class ErrorHandlingComponent implements OnInit {

  error = 'This is an Error';

  constructor() { }

  ngOnInit(): void {
  }

}
