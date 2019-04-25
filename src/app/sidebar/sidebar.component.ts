import { Component, OnInit } from '@angular/core';
import { User, UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  name: string = "not loaded";
  loginCheck = false;

  constructor(private userService: UserService, public auth: AuthService) {
    
   }

  ngOnInit() {
    this.auth.user.forEach( state =>{
      if (state){
        this.name = "logged in - " + state.name;
      }
      else{
        this.name = "logged out";
        console.log(state);
      }
      this.loginCheck = true;

    })
    
  }


}
