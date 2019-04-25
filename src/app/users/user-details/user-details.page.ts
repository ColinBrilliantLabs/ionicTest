import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { NavExtrasService } from '../../services/navExtrasService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: User = this.userService.getEmptyUser();
  index: number = 0;

  constructor(private navExtrasService: NavExtrasService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    //If we didn't get nav info from users page
    if (this.navExtrasService.getExtras() == null){
      const userId = this.route.snapshot.paramMap.get('id');
      const tempUser = this.getLocalStorage(userId);
      //If local storage doesn't have this users info
      if (tempUser === null){
        //disable inputs
        //call db and get user using id sent into param
        this.userService.getUserFromId(userId).valueChanges().subscribe(user => {
          
          this.user = user;
          this.updateUserLocalStorage(user);
        }); 
        //update local storage
        //set user = db stuff
        //enable inputs
      }
      else{
        this.user = tempUser;
        this.updateUserLocalStorage(this.user);
      }
    }
    else{
      this.user = this.navExtrasService.getExtras();
      this.updateUserLocalStorage(this.user);
    }
  }

  getLocalStorage(userId){
    return JSON.parse(localStorage.getItem('editUser/' + userId));
  }

  updateUserLocalStorage(user){
    localStorage.removeItem('editUser/' + user.docId);
    localStorage.setItem('editUser/' + user.docId, JSON.stringify(user));
  }

  previous(){
    this.index--;
  }

  next(){

    this.userService.updateUser(this.user, this.user.docId);
    this.updateUserLocalStorage(this.user.docId);
    this.index++;
  }

}
