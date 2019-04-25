import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { User, UserService } from "../services/user.service";
import { Pet, PetService } from "../services/pet.service";
import { NavExtrasService } from "../services/navExtrasService";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { setupConfig } from '@ionic/core';

@Component({
  selector: 'app-users',
  templateUrl: 'users.page.html',
  styleUrls: ['users.page.scss']
})

export class UsersPage implements OnInit {

    users: any[] = [];

    name: string;

    petsToAdd: Pet[] = [];

    loading = false;

    constructor(private userService: UserService, private petService: PetService,
         private navExtrasService: NavExtrasService, private router: Router, public auth: AuthService) {
        
    }

    ngOnInit() {

        this.loading = true;

        //My god, this is stupid. Firestore caches stuff to help save users mobile data, but in angular2Firestore specifically,
        //there is no way to turn off caching. Because of this, the current user is grabbed in auth.service for the header,
        //and then when we do a userscollection.valueChanges(), it grabs the cached user data (the logged in user), and displays
        //it immediately, and then the rest of the data is updated when the server responds. This causes a huge jitter and looks awful
        //Hacky solution: ref.get returns non cached data from the db, but it doesn't have live reloading so data won't update.
        //To solve that, we wrap it in valueChanges(). So each time a user is updated, valueChanged gets called and then we send out
        //ANOTHER call to the db for the static, non cached data. 
        //This is a current angular bug and will hopefully be fixed sometime in the future.
        //To whoever is reading this: figuring out the error was from data caching took me a whole day of wanting to die, and finding the 
        //solution took another half day. You're welcome.
        this.userService.getUsersCollection().valueChanges().subscribe(() =>{
            this.userService.getUsersCollection().ref.get().then(usersArray=>{
                 
                 //happens once per db update
                 this.users = [];
                 this.petsToAdd = [];
                 //loop through each user
                 usersArray.forEach(user => {
                     
                     this.users.push(user.data());
     
                     const emptyPet = this.petService.getEmptyPet();
                     this.petsToAdd.push(emptyPet);
     
                     //You have to create the users index here, and NOT inside petService snapshot as these are all async which means
                     //a second instance of userSnapshot can run before the first instance of of petService runs.
                     //The error this would cause is basically, userService runs once, adds first user and tells petService to run
                     //Then, before the first petService runs, the second userService runs, adding the second element to the array
                     //causing the 1st instance of petService to grab the 2nd users array if they used this.users[this.users.length -1]
                     //Do this for every join
                     let currentIndex = this.users.length - 1;
     
                     
                     this.petService.getPetsFromUserId(user.data().docId).valueChanges().forEach(petsArray =>{
                         //happens once per db update
                         //tempUsers[currentIndex].pets = [];
                         this.users[currentIndex].pets = [];
                         //loop through each pet
                         petsArray.forEach(pet => {
                             this.users[currentIndex].pets.push(pet);
                         });
     
                         //console.log("index: " + currentIndex + ", length: " + (results.size));
                         if (currentIndex === usersArray.size - 1){
                             //console.log("test");
                             //this.users = tempUsers;
                             //this.petsToAdd = tempPetsToAdd;
                             this.loading = false;
                         }
                     });
                     
                     
                 });
             });
        })

        

    }

    addUser() {
        let user = this.userService.getEmptyUser();
        user.name = this.name;
        this.userService.addUser(user);

    }

    addPet(userId, index) {
        let pet: Pet = {
            userId: userId,
            species: this.petsToAdd[index].species,
            name: this.petsToAdd[index].name,
            docId: "",
        }
        this.petService.addPet(pet); 
        this.petsToAdd[index].species = "";
        this.petsToAdd[index].name = "";

    }

    deletePet(petId){
        this.petService.removePet(petId);
    }

    remove(item) {
        this.userService.removeUser(item.id);
    }

    callEditUser(user){
        this.navExtrasService.extras = user;
        this.router.navigateByUrl('/tabs/users/edit/' + user.docId);
    }
}
