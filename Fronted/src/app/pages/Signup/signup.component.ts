import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthServiceService } from 'src/app/services/userAuth/user-auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  buttonText: string = 'Sign Up';

  constructor(
    private fb: FormBuilder,
    private authServices: UserAuthServiceService,
    private router:Router
  ) {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value); 
      this.authServices.signup(this.signupForm.value).subscribe(
        (response) => {
          console.table('Success', response);
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Signup Error:', error);
          alert(error.error.message)
          if (error.status === 500) {
            console.error('Internal Server Error. Please try again later.');
          } else {
            console.error('Unknown error occurred. Please check server logs for details.');
          }
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  get fullname() {
    return this.signupForm.get('fullName');
  }

  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }
}
