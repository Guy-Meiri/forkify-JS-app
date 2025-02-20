import axios from 'axios';
import {proxy} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        //const proxy = 'https://cors-anywhere.herokuapp.com/';
        //const proxy = 'https://crossorigin.me/';
        //console.log("in getRes");
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }

}