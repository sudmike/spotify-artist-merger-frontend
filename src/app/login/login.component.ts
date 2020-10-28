import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor() {
    window.location.href = 'http://localhost:3000/api/login';
  }

  ngOnInit(): void {
  }

}
