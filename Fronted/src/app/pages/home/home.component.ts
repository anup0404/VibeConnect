import { Component, OnInit } from '@angular/core';
import { SignupUser } from 'src/app/Interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
  export class HomeComponent implements OnInit {
    user: SignupUser | undefined; 
  
  
    ngOnInit() {
      this.user = history.state.user
    }
  }
