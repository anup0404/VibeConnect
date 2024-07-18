import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthServiceService } from 'src/app/services/userAuth/user-auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  buttonText: string = 'Login';

  constructor(
    private fb: FormBuilder,
    private authServices: UserAuthServiceService,
    private router: Router
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
          const userData = response.data.user;
          localStorage.setItem('Bearer ', JSON.stringify(userData));
          this.router.navigate(['/home'], { state: { user: userData } });
        },
        (error) => {
          console.error('Login Error:', error);
          alert(error.error.error);
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
      alert('please field the credentials');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
