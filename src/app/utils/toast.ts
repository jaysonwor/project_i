import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class Toast {
    constructor(
        private toastController: ToastController
    ) { }

    async error(message) {

        const toast = await this.toastController.create({
            message: message,
            color: 'danger',
            position: 'bottom',
            duration: 5000
        });
        toast.present();
    }

    async success(message) {

        const toast = await this.toastController.create({
            message: message,
            color: 'success',
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    async info(message) {

        const toast = await this.toastController.create({
            message: message,
            color: 'primary',
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    // async persistToast(message, color) {
    //     const toast = await this.toastController.create({
    //         message: message,
    //         color: color,
    //         position: 'top'
    //     });
    //     toast.present();
    // }
}
