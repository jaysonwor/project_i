import { Injectable, OnInit } from "@angular/core";
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Log } from "./log";

const IMAGE_DIR = 'stored-images';
const IMAGE_PARENT_DIR = Directory.Cache;

@Injectable({
    providedIn: 'root'
})
export class PhotoUtils implements OnInit {
    profilePath: string = 'profile' + '.jpeg';

    constructor(
        private plt: Platform,
        private log: Log
    ) { }

    async ngOnInit() {
        if (this.plt.is('hybrid')) {
            await this.createDirectory();
        } else {
            throw new Error("Method not implemented.");
        }
    }

    async chooseImage() {
        const [err, res] = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos // Camera, Photos or Prompt!
        }).
            then(v => [null, v], err => [err, null]);

        //if mobile device it needs to be converted/saved then loaded
        //otherwise return the raw form
        if (err) {
            this.log.error("chooseImage: error: " + err);
            throw new Error(err);
        } else {
            this.log.debug("chooseImage: success: " + JSON.stringify(res));
            if (this.plt.is('hybrid')) {
                await this.saveImage(res);
                return await this.loadProfilePic();
            } else {
                return await this.readAsBase64(res);
            }
        } 

    }

    async saveImage(photo: Photo) {
        const base64Data = await this.readAsBase64(photo);
        const filePath = `${IMAGE_DIR}/${this.profilePath}`;
        const [err, res] = await Filesystem.writeFile({
            path: filePath,
            data: base64Data,
            directory: IMAGE_PARENT_DIR
        }).
            then(v => [null, v], err => [err, null]);

        if (err) {
            this.log.error("saveImage: error: " + err);
            throw new Error(err);
        } else {
            this.log.debug("saveImage: success: " + JSON.stringify(res));
            return res;
        }

        //   return (err) ? err : res;
        // this.debug.push("saving image has error " + JSON.stringify(err));
        // this.debug.push("saved picture " + (res));
        // Reload the file list
        // Improve by only loading for the new image and unshifting array!
        // await this.loadFileData();
        // return res;
    }

    async createDirectory() {
        const [err, res] = await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: IMAGE_PARENT_DIR,
        }).
            then(v => [null, v], err => [err, null]);

        if (err) {
            this.log.error("createDirectory: error: " + err);
            throw new Error(err);
        } else {
            this.log.debug("createDirectory: success: " + JSON.stringify(res));
            return res;
        }
    }

    async loadProfilePic() {
        //check for mobile device 
        //otherwise assume web
        if (this.plt.is('hybrid')) {
            const filePath = `${IMAGE_DIR}/${this.profilePath}`;
            const [err, res] = await Filesystem.readFile({
                path: filePath,
                directory: IMAGE_PARENT_DIR,
            }).
                then(v => [null, v], err => [err, null]);

            if (err) {
                this.log.error("loadProfilePic: error: " + err);
                throw new Error(err);
            } else {
                // this.log.debug("loadProfilePic: success: " + JSON.stringify(res));
                return `data:image/jpeg;base64,${res.data}`;
            
            }
        } else {
            //todo handle this better
            return "";
        }   
    }

    // async getFiles() {
    //     const [err, res] = await Filesystem.readdir({
    //         path: IMAGE_DIR,
    //         directory: IMAGE_PARENT_DIR,
    //     }).
    //         then(v => [null, v], err => [err, null]);

    //     if (err) {
    //         this.log.error("getFiles: error: " + err);
    //         throw new Error(err);
    //     } else {
    //         this.log.debug("getFiles: success: " + JSON.stringify(res));
    //         return res;
    //     }
    // }

    private async readAsBase64(photo: Photo) {
        if (this.plt.is('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path
            });

            return file.data;
        }
        else {
            // Fetch the photo, read as a blob, then convert to base64 format
            const response = await fetch(photo.webPath);
            const blob = await response.blob();

            return await this.convertBlobToBase64(blob) as string;
        }
    }

    private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });



}
