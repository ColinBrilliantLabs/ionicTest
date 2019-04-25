import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User, UserService } from './user.service';

import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    

    user: any;

    constructor(private userService: UserService, private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
        
        this.updateUserState();

    }

    updateUserState(){

        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    console.log("not null");
                    return this.userService.getUserFromId('o7QDxAHZG1cCqKy6T7nM').valueChanges();
                } else {
                    console.log("null");
                    return of(null);
                }
               
            })
        );
        

    }

    getCurrentUser(){
        console.log(this.user.docId);
        return this.user.docId;
    }

    emailSignUp(credentials) {
        return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(credentials.email, credentials.password)
          .then(() => console.log("success"))
          .catch(error => console.log(error));
      }

    signInWithEmail(credentials) {
      return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password).then(() => {
          console.log("success - sign in");
          this.updateUserState();
      })
      .catch(error => console.log(error));
	}
      
    signOut(){
        this.afAuth.auth.signOut().then(() => {
            console.log("success - sign out");
        this.updateUserState();

        })
        .catch(error => console.log(error));
        //return this.router.navigate(["/"]);
    }

    updateUserData(user){
        const userRef: AngularFirestoreDocument<User> = this.afs.doc('users/${user.uid}');

        const data = {
            uid: user.uid,
            name: user.name,
            age: user.age

        }
        return userRef.set(data, {merge: true});
    }

}

