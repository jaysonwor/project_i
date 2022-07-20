import { Injectable } from "@angular/core";
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import * as saveAs from 'file-saver';
import { Log } from "./log";

import { File } from '@awesome-cordova-plugins/file/ngx';

@Injectable({
    providedIn: 'root'
})
export class VideoUtils {
    public videos = [];
    private VIDEOS_KEY: string = 'videos';

    constructor(
        private log: Log,
        private file: File
    ) { }

    async loadVideos() {
        const videoList = await Storage.get({ key: this.VIDEOS_KEY });
        this.videos = JSON.parse(videoList.value) || [];
        return this.videos;
    }

    async saveFileWeb(blob) {
        const base64Data = await this.convertBlobToBase64(blob) as string;
        const filePath = Directory.Data + "/" + new Date().getTime() + '.mp4';
        const savedFile = await this.file.writeFile(
            Directory.Data,
            new Date().getTime() + '.mp4',
            base64Data,
            { replace: true, append: false }
        );
    }

    async copyFileToLocalDir(fullPath) {
        
        let myPath = fullPath;
        // Make sure we copy from the right location
        if (fullPath.indexOf('file://') < 0) {
            myPath = 'file://' + fullPath;
        }

        const ext = myPath.split('.').pop();
        const d = Date.now();
        const newName = `${d}.${ext}`;

        const name = myPath.substr(myPath.lastIndexOf('/') + 1);
        const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
        const copyTo = Directory.Data;

        this.log.debug(name)
        this.log.debug(copyFrom)
        this.log.debug(newName)
        this.log.debug(copyTo)
        const [err, res] = await Filesystem.copy({
            from: myPath,
            to: newName,
            toDirectory: copyTo
        })
            .then(v => [null, v], err => [err, null]);

        if (err) {
            this.log.error("DEBUG " + err)
        }

        this.log.info("savedFile")
        const savedFile = await Filesystem.getUri({
            path: newName,
            directory: Directory.Data
        });
        this.log.info(savedFile.uri)

        return this.storeVideo(savedFile.uri);

        // this.file.copyFile(copyFrom, name, copyTo, newName).then(
        //   success => {
        //     this.loadFiles();
        //   },
        //   error => {
        //     console.log('error: ', error);
        //   }
        // );
    }

    async storeVideo(blob) {
        const fileName = new Date().getTime() + '.mp4';
        // const filePath = Directory.Data+"/"+new Date().getTime() + '.mp4';
        const filePath = blob;

        // const base64Data = await this.convertBlobToBase64(blob) as string;
        // // const savedFile = await Filesystem.writeFile({
        // //     path: fileName,
        // //     data: base64Data,
        // //     directory: Directory.Data
        // // });
        // saveAs(base64Data, filePath)

        // Add file to local array
        // this.videos.unshift(savedFile.uri);
        this.videos.unshift(filePath);

        // Write information to storage
        return Storage.set({
            key: this.VIDEOS_KEY,
            value: JSON.stringify(this.videos)
        });
    }

    async saveLocalWebVideo(blob) {
        const fileName = new Date().getTime() + '.mp4';
        // const filePath = Directory.Data+"/"+new Date().getTime() + '.mp4';
        const filePath = blob;

        const base64Data = await this.convertBlobToBase64(blob) as string;
        // // const savedFile = await Filesystem.writeFile({
        // //     path: fileName,
        // //     data: base64Data,
        // //     directory: Directory.Data
        // // });
        saveAs(base64Data, filePath)

        // Add file to local array
        // this.videos.unshift(savedFile.uri);
        this.videos.unshift(filePath);

        // Write information to storage
        return Storage.set({
            key: this.VIDEOS_KEY,
            value: JSON.stringify(this.videos)
        });
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
        // this.log.info(Directory.Data)
        const path = fullPath.substr(fullPath.lastIndexOf('/') + 1);
        // this.log.info(path)
        const [err, res] = await Filesystem.getUri({
            path: path,
            directory: Directory.Data
        })
            .then(v => [null, v], err => [err, null]);

        if (err) {
            this.log.error("DEBUG " + err)
        }
        // return `data:video/mp4;base64,${res.data}`;
        return res.uri;
    }
}