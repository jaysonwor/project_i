import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppConstants {

    SESSION_ACTIVE = "PROJECTI.SESSION.ACTIVE";
    ACCESSKEY = "PROJECTI.ACCESSKEY";
    SACCESSKEY = "PROJECTI.SACCESSKEY";
    SESSIONTOKEN = "PROJECTI.SESSIONTOKEN";
    IDTOKEN = "PROJECTI.IDTOKEN";

    logoShow: boolean = true;
    password_policy = "Password policy: uppercase letters, lowercase letters, special characters, numbers";

    validation_messages = {
        'name': [
            { type: 'required', message: 'name is required' }
        ],
        'email': [
            { type: 'required', message: 'email is required' },
            { type: 'pattern', message: 'email format is invalid' }
        ],
        'currentPassword': [
            { type: 'required', message: 'current password is required' },
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
