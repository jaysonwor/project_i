import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MediaCapture, MediaFile, CaptureError } from '@awesome-cordova-plugins/media-capture/ngx';
import { Capacitor } from '@capacitor/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { ApiService } from 'src/app/services/api.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { EventService } from 'src/app/services/event.service';
import { Log } from 'src/app/utils/log';
import { PhotoUtils } from 'src/app/utils/photo';
import { ToastUtil } from 'src/app/utils/toast';
import { VideoUtils } from 'src/app/utils/video';
import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';
import * as Record from 'videojs-record/dist/videojs.record.js';
import { AppConstants } from 'src/app/app.constants';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-studio',
  templateUrl: './studio.page.html',
  styleUrls: ['./studio.page.scss'],
})
export class StudioPage implements OnInit, OnDestroy {
  video: any;
  videoPlayer: any;
  videos = [];
  formState: string = null;
  duration = 60
  isDevice: boolean = Capacitor.isNativePlatform();
  private config: any;
  private player: any;
  private plugin: any;

  constructor(
    // private cognitoService: CognitoService,
    private apiService: ApiService,
    private toast: ToastUtil,
    // private photo: PhotoUtils,
    // private event: EventService,
    // private router: Router,
    // private changeDetector: ChangeDetectorRef,
    // private video: VideoUtils,
    private mediaCapture: MediaCapture,
    private log: Log,
    public appConstants: AppConstants,
    private plt: Platform
    // private file: File
  ) {
    if (!Capacitor.isNativePlatform()) {
      // inits the videojs-record plugin
      this.plugin = Record;

      // video.js configuration
      this.config = { 
        controls: true,
        plugins: {
          record: {
            audio: true,
            video: true,
            maxLength: this.duration,
            debug: true,
          }
        }
      };
    }
  }

  ngOnInit() {
    this.formState = this.appConstants.LOADING;
  }

  ngAfterViewInit() { 
    if (Capacitor.isNativePlatform()) {
      this.videoPlayer = CapacitorVideoPlayer;
      this.formState = this.appConstants.RECORD_READY;
    } else {
      this.player = this.initWebRecorder(1);
    }
  }

  ngOnDestroy() {
    if (!Capacitor.isNativePlatform()) {
      this.player.dispose();
    }
    this.resetStates;
  }

  private resetStates() {
    this.formState = null;
  }

  private initWebRecorder(i): any {
    // ID with which to access the template's video element
    const el = 'recorder_' + i;

    // setup the player via the unique element ID
    const player: any = videojs(el, this.config, () => {
      this.log.debug(`player ready! id: ${el}`);
    });

    // player.on('onPlayerReady', () => {
    //   this.log.info('playback!');
    // });

    // device is ready
    player.on('deviceReady', () => {
      this.toast.info('ready to record');
      this.formState = this.appConstants.RECORD_READY;
    });

    // user clicked the record button and started recording
    player.on('startRecord', () => {
      this.toast.info('recording started');
    });

    // user completed recording and stream is available
    player.on('finishRecord', async () => {
      const blob = this.player.recordedData;
      this.log.debug('finished recording: ' + JSON.stringify(blob));
      this.toast.info('ready to upload');
      //convert to base64 encoded
      const base64: any = await this.blobToBase64(blob);
      //strip the codec from the base64 encoding e.g
      //type: "video/x-matroska;codecs=avc1,opus"   
      //needed to properly decode the file
      this.video = base64.split(",").pop();
      this.formState = this.appConstants.UPLOAD_READY;
    });

    // error handling
    player.on('error', (element, error) => {
      this.log.error(error);
      this.toast.error(error)
    });

    player.on('deviceError', () => {
      this.log.error(`device error: ${player.deviceErrorCode}`);
      this.toast.error("video recorder not ready");
    });

    //init device
    player.record().getDevice();

    return player;
  }

  async record() {
    // this.isRecording = true;
    if (Capacitor.isNativePlatform()) {
      this.nativeRecord();
    } else {
      this.webRecord();
    }
  }

  private async nativeRecord() {
    this.log.debug("starting video recorder");
    const options = { duration: this.duration, quality: 0, limit: 1 };
    const [err, data] = await this.mediaCapture.captureVideo(options).
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error(`video recorder not ready: ${JSON.stringify(err)}`);
      this.toast.error("video recorder not ready");
    } else {
      this.log.debug('finished recording: ' + JSON.stringify(data));
      this.video = await this.readAsBase64(data[0]);
      this.formState = this.appConstants.UPLOAD_READY;
      await this.uploadVideo();
    }
  }

  private async webRecord() {
    this.player.record().start();
  }

  stopRecord() {
    if (Capacitor.isNativePlatform()) {
      //nothing, native record function covers this
    } else {
      this.player.record().stop();
    }
    // this.isRecording = false;
  }

  async uploadVideo() {
    this.formState = this.appConstants.LOADING;
    const [err, res] = await this.apiService.saveVideo(this.video).
      then(v => [null, v], err => [err, null]);

    if (err) {
      this.log.error(JSON.stringify(err));
      this.toast.error(`error occurred uploading video: ${JSON.stringify(err)}`);
      this.formState = this.appConstants.UPLOAD_ERROR;
    } else {
      this.formState = this.appConstants.UPLOAD_SUCCESS;
    }
  }

  private async readAsBase64(video: any) {
    const path = "file://" + video.fullPath;
    this.log.debug(path)
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: path
      });

      return file.data;
    }
  }

  private blobToBase64(blob) {
    // blob = new Blob(blob, {type : "video/webm"})
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // this.log.info('Base64 String - ' + reader.result);
        return resolve(reader.result);
      }
      reader.readAsDataURL(blob);
      // reader.readAsBinaryString(blob);
    });
  }

}