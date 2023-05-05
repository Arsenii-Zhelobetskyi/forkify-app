// a lot easier is to start from a model when you are adding some features
import { API_URL, KEY, RES_PER_PAGE } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';
export const state = {
  // all data that we need in order to build our application
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1, //start page number
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data; // as we have recipe on both site we could use destructuring
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //here is some hard part:(we will conditionally add a property)
    ...(recipe.key && { key: recipe.key }), // if first part is false, nothing gonna happend, otherwise the second part will be executed, and result will be : key:recipe.key
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmarks => bookmarks.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    // temporary error handling
    console.error(`${err}😾😾😾😾`);
    throw err;
  }
}; // function only change the state object

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}😾😾😾😾`);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //state.search.resultsPerPage- amount of results on the page that we want
  const end = page * state.search.resultsPerPage;

  return state.search.result.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //     new quantity= old quantity * newServings/oldServings //
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; // a new property
  persistBookmarks();
};
export const removeBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}; //common pattern: if we want add something we pass the whole object, if we delete something we pass only  id

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); // json.parse-convert the string to object
};
init();
const clearBookmarks = function () {
  localStorage.clear();
};

// clearBookmarks(); //for development purpose, not used in the functionality
export const uploadRecipe = async function (newRecipe) {
  try {
    // take raw data, transform it into an object
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :D'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime, //+ convert to number
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
};
