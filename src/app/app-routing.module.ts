import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/users', pathMatch: 'full' },
  { 
    path: 'recipes',
    children: [
      {
        path: '',
        loadChildren: './recipes/recipes.module#RecipesPageModule'

      },
      {
        //Colon means anything can be after recipes. Ex: recipes/1. The id would now be 1
        path: ':recipeId',
        loadChildren: './recipes/recipe-detail/recipe-detail.module#RecipeDetailPageModule'
      }
    ]
  },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule'},
  { path: 'user-details', loadChildren: './users/user-details/user-details.module#UserDetailsPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
