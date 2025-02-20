export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

export const elementString = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
    <div class="${elementString.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        <svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
    //console.log("in loader");
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if(loader){
        loader.parentNode.removeChild(loader);
    }
}