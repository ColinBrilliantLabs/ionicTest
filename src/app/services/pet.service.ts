import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Pet {
    species: string;
    userId: string;
    name: string;
    docId?: string;
}

@Injectable({
    providedIn: 'root'
})

export class PetService {

    private petsCollection: AngularFirestoreCollection<Pet>;

    private pets: Observable<Pet[]>;

    private db: AngularFirestore;

    constructor(db: AngularFirestore) {
        this.db = db;

        this.petsCollection = db.collection<Pet>("pets");
        this.pets = this.petsCollection.valueChanges();
    }

    getEmptyPet() {
        let pet: Pet = {
            userId: "",
            species: "",
            name: "",
        }
        return pet;
    }

    getPets() {
        return this.pets;
    }

    getPetsCollection(){

        return this.petsCollection;
    }

    getPetFromId(id) {
        return this.petsCollection.doc<Pet>(id);
    }
    
    getPetsFromUserId(userId) {
        return this.db.collection<Pet>('pets', ref => ref.where('userId', '==', userId));
    }

    updatePet(pet: Pet, id: string) {
        delete pet.docId;
        return this.petsCollection.doc(id).update(pet);
    }

    addPet(pet: Pet) {
        const id = this.db.createId();
        pet.docId = id;
        return this.petsCollection.doc(id).set(pet);
    }


    removePet(id) {
        return this.petsCollection.doc(id).delete();
    }

    removePets() {

        this.petsCollection.snapshotChanges().forEach(a => {
            a.forEach(item => {
                const data = item.payload.doc.data();
                if (data.species != "test") {
                    const id = item.payload.doc.id;
                    this.petsCollection.doc(id).delete();
                }
            });
        });
    }

}