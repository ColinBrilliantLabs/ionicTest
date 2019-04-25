import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Recipe[] = [
    {
      id: "r1",
      title: "Schnitzel",
      imageUrl: "https://via.placeholder.com/300/09f.png/fff%20C/O%20https://placeholder.com/",
      ingredients: ["French Fries", "Pork Meat", "Salad"]
    },
    {
      id: "r2",
      title: "Spaghetti",
      imageUrl: "https://via.placeholder.com/300/09f.png/fff%20C/O%20https://placeholder.com/",
      ingredients: ["French Fries", "Pork Meat", "Salad"]
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
