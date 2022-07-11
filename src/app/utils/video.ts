import { Injectable } from "@angular/core";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Storage } from "@capacitor/storage";
import { Log } from "./log";
// import { File } from '@awesome-cordova-plugins/file/ngx';
// import { File } from '@ionic-native/file';
// import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import write_blob from 'capacitor-blob-writer';
import { saveAs } from 'file-saver';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileSaverDirective, FileSaverService } from 'ngx-filesaver';

@Injectable({
    providedIn: 'root'
})
export class VideoUtils {
    public videos = [];
    private VIDEOS_KEY: string = 'videos';

    constructor(
        private log: Log,
        private file: File,
        private _FileSaverService: FileSaverService
    ) { }

    async loadVideos() {
        const videoList = await Storage.get({ key: this.VIDEOS_KEY });
        this.videos = JSON.parse(videoList.value) || [];
        return this.videos;
    }

    private async writeAndOpenFile(data: any, fileName: string) {
        var reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onloadend = async function () {
            var base64data = reader.result;
            try {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: <string>base64data,
                    directory: Directory.Data,
                    recursive: true
                });
                let fileOpener: FileOpener = new FileOpener();
                fileOpener.open(result.uri, data.type)
                    .then(() => console.log('File is opened'))
                    .catch(e => console.log('Error opening file', e));
    
                console.debug('Wrote file', result.uri);
            } catch (e) {
                console.error('Unable to write file', e);
            }
        }
    }
    

    async storeVideo(blob) {
        const fileName = new Date().getTime() + '.mp4';
        const base64Data = await this.convertBlobToBase64(blob) as string;
        const filePath = Directory.Data + "/" + fileName

        if (Capacitor.isNativePlatform()) {
            this.writeAndOpenFile(blob, filePath);
            // const [err, res] = await this.file.writeFile(
            //     Directory.Data,
            //     fileName,
            //     base64Data,
            //   ).
            //   then(v => [null, v], err => [err, null]);

            // if(err) {
            //     this.log.error(err)
            // } else {
            //     const savedFile = res;
            //     this.log.debug(savedFile)
            //     // // Add file to local array
            //     // this.videos.unshift(savedFile.uri);

            //     // // Write information to storage
            //     // return Storage.set({
            //     //     key: this.VIDEOS_KEY,
            //     //     value: JSON.stringify(this.videos)
            //     // });
            // }
        } else {
            
            this._FileSaverService.save(blob, filePath);
            // saveAs(base64Data, filePath);

            // this.log.debug(filePath)
            // this.writeAndOpenFile(blob, filePath)
        }
        // this.log.debug(base64Data);

        // const [err, res] = await this.file.writeFile(
        //     Directory.Data,
        //     fileName,
        //     base64Data,
        //   ).
        //   then(v => [null, v], err => [err, null]);

        // const [err, res] = await Filesystem.writeFile({
        //         path: fileName,
        //         data: base64Data,
        //         directory: Directory.Data,
        //       }).
        //       then(v => [null, v], err => [err, null]);

        // const [err, res] = await write_blob({
        //     directory: Directory.Data,
        //     path: fileName,
        //     blob: blob
        //   });



        // if(err) {
        //     this.log.error(err)
        // } else {
        //     const savedFile = res;
        //     this.log.debug(savedFile)
        //     // // Add file to local array
        //     // this.videos.unshift(savedFile.uri);

        //     // // Write information to storage
        //     // return Storage.set({
        //     //     key: this.VIDEOS_KEY,
        //     //     value: JSON.stringify(this.videos)
        //     // });
        // }

        // const savedFile = await Filesystem.writeFile({
        //     path: fileName,
        //     data: base64Data,
        //     directory: Directory.Data,
        //   });

        // this.log.debug(savedFile);
        // const savedFile = await Filesystem.writeFile({
        //     path: fileName,
        //     data: base64Data,
        //     directory: Directory.Data
        // });


    }

    // Helper function
    private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    // Load video as base64 from url
    async getVideoUrl(fullPath) {
        const path = fullPath.substr(fullPath.lastIndexOf('/') + 1);
        const file = await Filesystem.readFile({
            path: path,
            directory: Directory.Data
        });
        return `data:video/mp4;base64,${file.data}`;
    }
}
