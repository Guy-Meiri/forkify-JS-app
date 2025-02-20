import axios from 'axios';
import {proxy} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime(){
        //assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon',  'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g' ]; 
        const newIngredients = this.ingredients.map(el => {
            //uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            
            //parse ingredients into count, unit and ingredient
            const ingredientsArr = ingredient.split(' ');
            const unitIndex = ingredientsArr.findIndex(el2 => units.includes(el2));

            let objIng;

            if (unitIndex > -1){
                //there is a unit
                // ex. 4 1/2 cups, arrcount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // ex. 4 1/2 cups, arrcount is [4]
                const arrCount = ingredientsArr.slice(0, unitIndex); 
                let count;
                if(arrCount === 1){
                    count = ingredientsArr[0].replace('-', '+');
                }else{
                    count = eval(ingredientsArr.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count: count,
                    unit: ingredientsArr[unitIndex],
                    ingredient: ingredientsArr.slice(unitIndex+1).join(' ')
                }
            }else if(parseInt(ingredientsArr[0], 10)){
                // there is no unit, but the first elemnt is a number
                objIng = {
                    count: parseInt(ingredientsArr[0], 10),
                    unit: '',
                    ingredient: ingredientsArr.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                // there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }

            return objIng;

        });
        this.ingredients = newIngredients;
    }

    //type is 'dec' or 'inc'
    updateServings(type){
        const newServings = type === 'dec'? this.servings -1 : this.servings + 1;

        const ingredArray = Array.from(this.ingredients);

        ingredArray.forEach(ing => {
            ing.count *= (newServings/this.servings);
        });

        this.servings = newServings;
    }
}
