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
  img = ""

  constructor(
    private cognitoService: CognitoService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async post() {
    // this.img = await this.apiService.post()
    // this.apiService.post().subscribe((response) => {
    //   console.log(response);
    //   this.img = `data:image/jpeg;base64,${response}`;
    // })

    const [err, res] = await this.apiService.post().
        then(v => [null, v], err => [err, null]);
    
        if(res) {
          console.log(res.data);
          this.img = `data:image/jpeg;base64,${res.data}`;
        }
    
  }

}
