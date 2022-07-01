import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/app.constants';
import { CognitoService } from 'src/app/services/cognito.service';
import { Toast } from 'src/app/utils/toast';
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
    private toast: Toast,
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
        // this.loading = false
        // this.toastService.toast("Password changed", "primary")
        this.toast.info("Password changed")
      },
      err => {
        // this.loading = false
        if (err.message.toString().toLowerCase().startsWith("incorrect username or password")) {
          err.message = "Error Saving: confirm current password is correct"
        }
        // console.log("ChangePasswordPage.change: failed, stack: " + err.message)
        this.toast.error(err.message)
      }
    );
    // console.log(this.cognitoService.email)
  }

}
