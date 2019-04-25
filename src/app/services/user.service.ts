import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface User {
    name: string;
    age: number;
    docId?: string;
}

@Injectable({
  providedIn: 'root'
})


export class UserService {

    private usersCollection: AngularFirestoreCollection<User>;
    private users: Observable<User[]>;

    private db: AngularFirestore;

    constructor(db: AngularFirestore) {

        this.db = db;
        this.usersCollection = db.collection<User>('users', ref => ref/*.where('name', '==', 'colin')*/);
        this.users = this.usersCollection.valueChanges();

    }

    getEmptyUser() {
        const user: User = {
            name: '',
            age: 0,
        }
        return user;
    }

    getUsers() {
        return this.users;
    }

    
    getUsersCollection() {
        return this.usersCollection;
    }

    getUserFromId(id) {
        return this.usersCollection.doc<User>(id);
    }

    updateUser(user: User, id: string) {
        return this.usersCollection.doc(id).update(user);
    }

    addUser(user: User) {
        const id = this.db.createId();
        user.docId = id;
        return this.usersCollection.doc(id).set(user);
    }

    removeUser(id) {
        return this.usersCollection.doc(id).delete();
    }

    removeUsers() {

        this.usersCollection.snapshotChanges().forEach(a => {
            let counter = 0;
            a.forEach(item => {
                counter ++;
                if (counter > 70){
                    return;
                }
                const data = item.payload.doc.data();
                if (data.name != "colinn") {
                    const id = item.payload.doc.id;
                    this.usersCollection.doc(id).delete();
                }
            });
        });
    }

    tutorialFunction() {
        //Never call this function
        let alwaysSetToTrue = true;
        if (alwaysSetToTrue) {
            return;
        }

        //LOOP THROUGH COLLECTION AND GET DATA READ ONLY

        //this is really weird but basically subscribe and forEach do the exact same thing
        //The first line is set to subscribe to make it more simple and this grabs one item, the whole collection of documents in one array
        this.users.subscribe((collection) => {
            //loop through every document

            collection.forEach(doc => {
                console.log(doc);

            })
        })

        //LOOP THROUGH COLLECTION AND GET DATA THAT YOU CAN UPDATE
        this.usersCollection.snapshotChanges().forEach(a => {
            a.forEach(item => {
                const id = item.payload.doc.id;
                console.log("id: " + id + ", data: " + item.payload.doc.data().name);
            });
        });

        /*
        * Get users without document id and join
        * this.userService.getUsers().subscribe(res => {

           this.users = res;

           this.users.forEach(user => {
               let pets: Observable<Pet[]> = this.petService.getPetsFromUserId(user.docId);
               pets.forEach(petsArray => {
                   user.pets = petsArray;
               })
           })

           

       });*/

        /*
         * Get users with document id and join
         * this.userService.getUsersCollection().snapshotChanges().forEach(usersArray => {


            usersArray.forEach(user => {
                const id = user.payload.doc.id;

                this.users.push(user.payload.doc.data());
                this.users[this.users.length - 1].docId = id;

                let pets: Observable<Pet[]> = this.petService.getPetsFromUserId(id);
                pets.forEach(petsArray => {
                    this.users[this.users.length - 1].pets = petsArray;
                })
            });
        });
    }
    */
    }
}