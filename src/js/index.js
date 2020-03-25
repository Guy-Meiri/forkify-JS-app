import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
// Global state of the app
const state = {};


/** search controller */
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput(); //TODO
    //console.log(query);

    if (query) {
        // new search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //search for recipes
        await state.search.getResults();

        //redner results on UI

        clearLoader();
        searchView.renderResults(state.search.result);
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
        console.log(goToPage);
    }

});

/**
 * Recipe controller
 */
const controlRecipe = async () => {
    //Get the ID from the url
    const id = window.location.hash.replace('#','');
    console.log(id);

    if (id){
        //prepare UI for changes

        //create new recipe object
        state.recipe = new Recipe(id);

        //get recipe data
        await state.recipe.getRecipe();

        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
 

        //render recipe on UI
        console.log(state.recipe);
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));