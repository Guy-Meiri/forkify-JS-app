import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

// Global state of the app
const state = {};


/** search controller */
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();
    //console.log("query:   " + query);

    if (query) {
        // new search object and add to state and parse ingredients

        //state.recipe.parseIngredients();
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //search for recipes
            await state.search.getResults();

            //redner results on UI

            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong');
            clearLoader();
        }
    }


}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();//prevents the page from reloading
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }

});

/**
 * Recipe controller
 */
const controlRecipe = async () => {
    //Get the ID from the url
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }


        //create new recipe object
        state.recipe = new Recipe(id);


        //get recipe data
        try {
            await state.recipe.getRecipe();
            console.log('----------');
            state.recipe.parseIngredients();

            //console.log(state.recipe.ingredients);

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();


            //render recipe on UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
            alert("Error processing the recipe!");
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
    }
    console.log(state.recipe);
});
