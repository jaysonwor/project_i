import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { ToastUtil } from 'src/app/utils/toast';
import { CustomValidator } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.page.html',
  styleUrls: ['./security-settings.page.scss'],
})
export class SecuritySettingsPage implements OnInit {
  form: any;

  constructor(
    private cognitoService: CognitoService,
    private formBuilder: FormBuilder,
    private toast: ToastUtil,
    public appConstants: AppConstants
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: ['', [Validators.required
      ]],
      password: ['', [Validators.required,
      Validators.minLength(8),
      Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
      ]],
      confirmPassword: ['', [Validators.required,
      ]]
    }, {
      validator: CustomValidator.mustMatch('password', 'confirmPassword')
    })
  }

  submit() {
    this.cognitoService.changePassword(
      this.cognitoService.email,
      this.form.controls.currentPassword.value,
      this.form.controls.password.value
    ).then(
      res => {
        this.toast.info("Password changed")
      },
      err => {
        if (err.message.toString().toLowerCase().startsWith("incorrect username or password")) {
          err.message = "Error Saving: confirm current password is correct"
        }
        this.toast.error(err.message)
      }
    );
  }

}
