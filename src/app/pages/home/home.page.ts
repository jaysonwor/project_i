import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastButton } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { EventService } from 'src/app/services/event.service';
import { PhotoUtils } from 'src/app/utils/photo';
import { ToastUtil } from 'src/app/utils/toast';

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
    private toast: ToastUtil,
    private photo: PhotoUtils,
    private event: EventService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.img = await this.photo.loadProfilePic();
    //todo: for now this needs to come after the first loadProfilePic()
    this.event.publishFormRefresh();
  }

  async post() {
    // this.img = await this.apiService.post()
    // this.apiService.post().subscribe((response) => {
    //   console.log(response);
    //   this.img = `data:image/jpeg;base64,${response}`;
    // })

    // const [err, res] = await this.apiService.getPhoto().
    //     then(v => [null, v], err => [err, null]);

    //     if(err) {
    //       this.toast.error("Failed to retrieve photo, check that you are authorized to perform this action");
    //     } else if(res) {
    //       console.log(res.data);
    //       this.img = `data:image/png;base64,${res.data}`;
    //     }

    // const [err, res] = await this.apiService.loadPhoto().
    //     then(v => [null, v], err => [err, null]);

  }

}
