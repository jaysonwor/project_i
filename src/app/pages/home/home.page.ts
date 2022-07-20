import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { EventService } from 'src/app/services/event.service';
import { PhotoUtils } from 'src/app/utils/photo';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  img = ""
  isDevice: boolean = Capacitor.isNativePlatform();

  constructor(
    private photo: PhotoUtils,
    private event: EventService
  ) {
  }

  async ngOnInit() {
    this.img = await this.photo.loadProfilePic();
    //todo: for now this needs to come after the first loadProfilePic()
    this.event.publishFormRefresh();
  }


}
