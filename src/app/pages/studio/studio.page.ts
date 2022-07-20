import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MediaCapture, MediaFile } from '@awesome-cordova-plugins/media-capture/ngx';
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

@Component({
  selector: 'app-studio',
  templateUrl: './studio.page.html',
  styleUrls: ['./studio.page.scss'],
})
export class StudioPage implements OnInit {
  // @ViewChild('video') captureElement: ElementRef;
  // mediaRecorder: any;
  videoPlayer: any;
  isRecording = false;
  // isPlaying = false;
  videos = [];
  // img = ""
  // options: { mimeType: string; };

  // reference to the element itself: used to access events and methods
  // private _elementRef: ElementRef

  // index to create unique ID for component
  // idx = 'clip1';

  private config: any;
  private player: any;
  // players: any = [];
  private plugin: any;

  isDevice: boolean = Capacitor.isNativePlatform();
  isDisabled: boolean = true;
  uploadReady: boolean = false;

  constructor(
    private cognitoService: CognitoService,
    private apiService: ApiService,
    private toast: ToastUtil,
    private photo: PhotoUtils,
    private event: EventService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private video: VideoUtils,
    private mediaCapture: MediaCapture,
    private log: Log,
  ) {
  }

  async ngOnInit() {
    // inits the videojs-record plugin
    this.plugin = Record;
    // this.plugin = TsEBMLEngine;

    // video.js configuration
    this.config = {
      controls: true,
      plugins: {
        record: {
          audio: true,
          video: true,
          maxLength: 60,
          // displayMilliseconds: false,
          debug: true,
          // convertEngine: 'ts-ebml'
        }
      }
    };
  }


  ionViewWillLeave() {
    if (!Capacitor.isNativePlatform()) {
      this.player.record().reset();
    }
    this.uploadReady = false;
  }

  async ionViewWillEnter() {
    this.uploadReady = false;
    if (Capacitor.isNativePlatform()) {
      this.videoPlayer = CapacitorVideoPlayer;
    } else {
      this.player = this.rtcVideo(1);
    }
    this.isDisabled = false;
  }



  rtcVideo(i): any {
    // ID with which to access the template's video element
    const el = 'video_'+i;

    // setup the player via the unique element ID
    const player: any = videojs(el, this.config, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    player.on('onPlayerReady', () => {
      this.toast.info('playback!');
    });

    // device is ready
    player.on('deviceReady', () => {
      this.toast.info('device is ready!');
    });

    // user clicked the record button and started recording
    player.on('startRecord', () => {
      this.toast.info('started recording!');
    });

    // user completed recording and stream is available
    player.on('finishRecord', async () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      // this.log.info('finished recording: ' + JSON.stringify(this.player.recordedData)); 
      // this.player.record().saveAs({'video': this.player.recordedData.name});      
      this.uploadReady = true;   

    });

    // player.on('startConvert', function() {
    //     console.log('started converting!');
    // });
    

    // converter ready and stream is available
    // player.on('finishConvert', function() {
    // // the convertedData object contains the converted data that
    // // can be downloaded by the user, stored on server etc.
    //   console.log('finished converting: ' + JSON.stringify(player.convertedData));
    // });

    // player.on('timestamp', function() {
    //   this.log.info("TIMESTAMPT");
    // });

    // error handling
    player.on('error', (element, error) => {
      this.toast.error(error);
    });

    player.on('deviceError', () => {
      // this.toast.error('device error: ' + player.deviceErrorCode);
      this.toast.error('device error: ' + player.deviceErrorCode);
    });

    player.record().getDevice();

    return player;
  }

  async record() {
    this.isRecording = true;
    if (Capacitor.isNativePlatform()) {
      this.nativeRecord();
    } else {
      this.webRecord();
    }
  }

  async nativeRecord() {
    const options = { duration: 60, quality: 0 };
    this.mediaCapture.captureVideo(options).then(
      async (data: MediaFile[]) => {
        await this.video.copyFileToLocalDir(data[0].fullPath);
        this.videos = this.video.videos;
        this.changeDetector.detectChanges();
        this.isRecording = false;
        this.uploadReady = true;
      })
  }

  async webRecord() {
    this.player.record().start();
  }

  stopRecord() {
    if (Capacitor.isNativePlatform()) {
      //nothing, native record function covers this
    } else {
      this.player.record().stop();      
    }
    this.isRecording = false;
  }

  async upload() {
    if (Capacitor.isNativePlatform()) {
      //nothing, native record function covers this
    } else {
      this.isRecording = false;
      const blob = this.player.recordedData;
      this.log.info('finished recording: ' + JSON.stringify(blob));  
      
      // console.log('Blob - ', blob);
      //type: "video/x-matroska;codecs=avc1,opus"      

      const b: any = await this.blobToBase64(blob);
      const base64NoTags = b.split (",").pop(); //needed for python version
      await this.apiService.saveVideo(base64NoTags);  
    }
    // this.ionViewWillLeave();  
  }

  private blobToBase64(blob) {
    // blob = new Blob(blob, {type : "video/webm"})
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log('Base64 String - ', reader.result);
        return resolve(reader.result);
      }
      reader.readAsDataURL(blob);
      // reader.readAsBinaryString(blob);
    });
  }
}