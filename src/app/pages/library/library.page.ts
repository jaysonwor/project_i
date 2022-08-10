import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Log } from 'src/app/utils/log';
import { ToastUtil } from 'src/app/utils/toast';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
import * as Record from 'videojs-record/dist/videojs.record.js';
import { AppConstants } from 'src/app/app.constants';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  private config: any;
  private player: any;
  private plugin: any;
  urls: string[] = [];
  count: number = 0;
  formState: string = null;
  playersMap: any;

  constructor(
    private apiService: ApiService,
    private log: Log,
    private toast: ToastUtil,
    public appConstants: AppConstants,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    console.log("ngOnInit");
    // video.js configuration
    this.config = {
      // sources: {
      //   src: this.url,
      //   type: "video/mp4"
      // },
      controls: true,
    };
  }

  ionViewWillLeave() {
    for (let pair of this.playersMap) {
      var [key, value] = pair;
      // console.log(key + " = " + value);
      videojs(key).reset();
    }
  }

  async ionViewWillEnter() {
    console.log("ionViewWillEnter");
    // this.count = 17
    // this.count = [0,1,2,3,4]
    const count = await this.countVideos();
    this.count = count.data
    console.log(count);

    this.formState = this.appConstants.UPLOADING;
    const response = await this.listVideos();
    this.urls = response.data;

    this.formState = "";

    this.playersMap = new Map();

    this.urls.forEach((objs, i) => {
      const obj = Object.entries(objs);
      const id = obj[0][0];
      const url = obj[0][1];
      // console.log(obj[0][1])
      // console.log(obj[1])
      let el = "player_" + i;
      this.playersMap.set(el, id);
      let player = videojs(el, this.config);
      player.src({ type: 'video/mp4', src: url });
      player.ready(function () {
        console.log('onPlayerReady', this);
      });
    })
  }

  private async listVideos() {
    const [err, res] = await this.apiService.listVideos().
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error(JSON.stringify(err));
      this.toast.error(`error getting videos: ${JSON.stringify(err)}`);
    } else {
      return res;
    }
  }

  private async countVideos() {
    const [err, res] = await this.apiService.countVideos().
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error(JSON.stringify(err));
      this.toast.error(`error counting videos: ${JSON.stringify(err)}`);
    } else {
      return res;
    }
  }

  private async delete(id) {
    console.log("Deleting...");
    const player = "player_" + id;
    const url = this.playersMap.get(player);
    const [err, res] = await this.apiService.deleteVideo(url).
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error(JSON.stringify(err));
      this.toast.error(`error deleting video: ${JSON.stringify(err)}`);
    } else {
      // return res;
      this.ionViewWillEnter();
    }
    // const [key, value] = this.playersMap.get(player);
    // console.log(this.playersMap.get(player))
    // console.log(value)
    // console.log("Deleteing ID = "+player);
  }

  async promptDelete(id) {
    const alert = await this.alertController.create({
      header: 'Confirm delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.delete(id);
          },
        },
      ],
    });

    await alert.present();
  }

}
