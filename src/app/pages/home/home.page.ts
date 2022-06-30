import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private cognitoService: CognitoService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.cognitoService.logOut();
    this.router.navigate(['login']);
  }

  post() {
    // this.apiService.post();
  }

}
