import { elements } from './base';
export const getInput = () => elements.searchInput.value;

export const clearInput = () => { elements.searchInput.value = '' };

export const clearResults = () => {
     elements.searchResList.innerHTML = '';
     elements.searchResPages.innerHTML = '';
    };


const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const newTitle = []
        title.split(' ').reduce((acc, word) => {
            if (acc < limit) {
                newTitle.push(word);
            }
            return acc + word.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
            <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
};
//type: 'prev' or 'next'
const createButton = (page, type) => `
            <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                </svg>
            </button>
            `;
const renderPagingButtons = (page, numResults, resPerPage) => {
    const totalNumPages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && totalNumPages > 1) {
        //on the first page - only show next button
        button = createButton(page, 'next');
    } else if (page === totalNumPages && totalNumPages > 1) {
        //on the last page - only show previous button
        button = createButton(page, 'prev');
    } else {
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `
    }

    elements.searchResPages.insertAdjacentHTML('beforeend', button);


};

export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = start + resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination
    renderPagingButtons(page, recipes.length, resPerPage);
};