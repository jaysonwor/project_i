import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppConstants {

    validation_messages = {
        'email': [
            { type: 'required', message: 'email is required' },
            { type: 'pattern', message: 'email format is invalid' }
        ],
        'password': [
            { type: 'required', message: 'password is required' },
            { type: 'minlength', message: 'password must be at least 8 chars' },
            { type: 'pattern', message: 'password policy mismatch' }
        ],
        'confirmPassword': [
            { type: 'required', message: 'confirm password is required' },
            { type: 'mustMatch', message: 'confirm password and password mismatch' }
        ],
        'verifyCode': [
            { type: 'required', message: 'verification code is required' }
        ]
    }
}
