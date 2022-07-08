import { Injectable, OnInit } from "@angular/core";
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Log } from "./log";

const IMAGE_DIR = 'stored-images';
const IMAGE_PARENT_DIR = Directory.Cache;
const PROFILE_PIC = "PROJECTI.PROFILE_PIC";

@Injectable({
    providedIn: 'root'
})
export class PhotoUtils implements OnInit {

    profilePath: string = 'profile' + '.jpeg';

    constructor(
        private plt: Platform,
        private log: Log
    ) {
    }

    async ngOnInit() {
        if (this.plt.is('hybrid')) {
            await this.createDirectory();
        } else {
            throw new Error("Method not implemented.");
        }
    }

    /**
     * Choose image from camera or photos and converts to compatible format for rendering
     * @returns base64 compatible formated image
     */
    async chooseImage() {
        const [err, res] = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt // Camera, Photos or Prompt!
        }).
            then(v => [null, v], err => [err, null]);

        //if mobile device it needs to be converted/saved then loaded
        //otherwise return the raw form
        if (err) {
            this.log.error("chooseImage: error: " + err);
            throw new Error(err);
        } else {
            this.log.debug("chooseImage: success: " + JSON.stringify(res));
            await this.saveImage(res);
            return await this.loadProfilePic();
        }

    }

    /**
     * Saves a photo to local disk (for mobile) or in session storage (for web)
     * @param base64Data 
     */
    async saveLocalBase64Image(base64Data) {
        if (this.plt.is('hybrid')) {
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
            }
        } else {
            sessionStorage.setItem(PROFILE_PIC, base64Data);
        }
    }

    /**
     * Saves a photo to local disk (for mobile) or in session storage (for web)
     * @param photo 
     */
    async saveImage(photo: Photo) {

        const base64Data = await this.readAsBase64(photo);
        const filePath = `${IMAGE_DIR}/${this.profilePath}`;

        //check for mobile device 
        //otherwise assume web and store in session
        if (this.plt.is('hybrid')) {
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
            }
        } else {
            // console.log(base64Data)
            sessionStorage.setItem(PROFILE_PIC, base64Data);
        }
    }

    /**
     * Creates the directory for local storage
     */
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
        }
    }

    /**
     * Gets a photo from local disk (if mobile) or session storage (if web)
     * @returns base64 encoded image
     */
    async loadProfilePic() {

        //check for mobile device 
        //otherwise assume web and store in session
        if (this.plt.is('hybrid')) {
            const filePath = `${IMAGE_DIR}/${this.profilePath}`;
            const [err, res] = await Filesystem.readFile({
                path: filePath,
                directory: IMAGE_PARENT_DIR,
            }).
                then(v => [null, v], err => [err, null]);

            if (err) {
                this.log.error("loadProfilePic: error: " + err);
                sessionStorage.setItem(PROFILE_PIC, "/assets/dummy-profile.png");
                return sessionStorage.getItem(PROFILE_PIC);
            } else {
                //todo: base64 encoded images are inneficient, but do this for now to get all pages to show the pic
                sessionStorage.setItem(PROFILE_PIC, `data:image/jpeg;base64,${res.data}`);
                return `data:image/jpeg;base64,${res.data}`;

            }
        } else {
            //todo: base64 encoded images are inneficient, but do this for now to get all pages to show the pic
            const pic = sessionStorage.getItem(PROFILE_PIC);
            if (!pic) sessionStorage.setItem(PROFILE_PIC, "/assets/dummy-profile.png");
            return sessionStorage.getItem(PROFILE_PIC);
        }
    }

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
