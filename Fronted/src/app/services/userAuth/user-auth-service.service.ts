import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginUser, SignupUser } from 'src/app/Interfaces/user';



@Injectable({
  providedIn: 'root'
})
export class UserAuthServiceService {
  private baseURL = "http://localhost:5000/";

  constructor(private http: HttpClient) {}

  signup(user: SignupUser): Observable<any> {
    const url = `${this.baseURL}api/users/register`; 
    return this.http.post(url, user);
  }

  autoLogin(): void {

    const userData = localStorage.getItem('Bearer');
    if(userData){
      JSON.parse(userData)
      console.log('Stored User Data:', userData);
    }else {
        console.log('No user data found in localStorage');
      }
    }
    
  login(user: LoginUser): Observable<any> {
    const url = `${this.baseURL}api/users/login`; 
    return this.http.post(url, user);
  }
}
