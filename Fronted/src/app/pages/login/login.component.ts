import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthServiceService } from 'src/app/services/userAuth/user-auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm :FormGroup;
  buttonText: string = 'Login';

  constructor(
    private fb: FormBuilder,
    private authServices: UserAuthServiceService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form value:', this.loginForm.value);

      this.authServices.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('Login successful', response);
        },
        (error) => {
          console.error('Login Error:', error);
          if (error.status === 401) {
            console.error('Unauthorized. Please check your credentials.');
          } else if (error.status === 500) {
            console.error('Internal Server Error. Please try again later.');
          } else {
            console.error(
              'Unknown error occurred. Please check server logs for details.'
            );
          }
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
