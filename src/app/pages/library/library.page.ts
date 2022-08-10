import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Log } from 'src/app/utils/log';
import { ToastUtil } from 'src/app/utils/toast';
import videojs from 'video.js';
import { AppConstants } from 'src/app/app.constants';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit, OnDestroy {
  private config: any;
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
  ) { 
    this.config = {
      controls: true,
    };
  }

  ngOnInit() {}  

  async ngAfterViewInit() {
    if (!Capacitor.isNativePlatform()) {
      this.formState = this.appConstants.LOADING;
      //theres a race condition with videojs renderer so need to hurry and render form elements
      //and we can do this by getting a count of bucket items and building the form
      //then creating the videojs objects
      await this.getVideosCount();    
      await this.renderVideos();
      this.resetStates();
    } else {
      //todo
    }
  }

  private async renderVideos() {
    const response = await this.listVideos();
    this.urls = response.data;
    this.playersMap = new Map();
    this.urls.forEach((objs, i) => {
      const obj = Object.entries(objs);
      const id = obj[0][0];
      const url = obj[0][1];
      let el = "player_" + i;
      this.playersMap.set(el, id);
      let player = videojs(el, this.config);
      player.src({ type: 'video/mp4', src: url });
      player.ready( () => {
        this.log.debug(`#${++i} ${id}, ready to play`);
      });
    });
  }

  private async getVideosCount() {    
    const count = await this.countVideos();
    this.count = count.data;
  }

  ngOnDestroy() {
    if (!Capacitor.isNativePlatform()) {
      for (let pair of this.playersMap) {
        var [key, value] = pair;
        videojs(key).reset();
      }
    } else {
      //todo
    }
  }

  private resetStates() {
    this.formState = null;
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
    const player = "player_" + id;
    const url = this.playersMap.get(player);
    const [err, res] = await this.apiService.deleteVideo(url).
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error(JSON.stringify(err));
      this.toast.error(`error deleting video: ${JSON.stringify(err)}`);
    } else {
      //todo: need to find a better to refresh but until just render all videos again 
      this.ngAfterViewInit();
    }
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
