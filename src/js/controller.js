// not concerned about the dom
import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView'; // we need that so main script(our controller) will execute that file, and object will be created and so eventlistener on the button will be called
import 'core-js/stable'; // for supporting old browsers
import 'regenerator-runtime/runtime'; // for supporting old browsers(polyfill)
if (module.hot) {
  module.hot.accept();
} //for parcel
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage()); // work with render, but will update pictures on search results
    // 1) update the bookmarks
    bookmarksView.update(model.state.bookmarks);
    // 2) loading recipe 288. Loading a Recipe from API
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    // 3) Rendering recipe 289. Rendering the Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  //subscriber
  try {
    resultsView.renderSpinner();
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);
    // 3) Render results
    // resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultsPage());
    //   4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
//controller which will be executed whenever one of the buttons of the pagination is clicked
const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //   4) Render NEW pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // update the recipe servings (in state
  model.updateServings(newServings);
  // update the Recipeview
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  // 1) add\remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // 2) update recipe view
  recipeView.update(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // render recipe:
    recipeView.render(model.state.recipe);
    // display a success message
    addRecipeView.renderMessage();
    // render  bookmark view
    bookmarksView.render(model.state.bookmarks); //not update, cause we add the element(update not work for different quantity of items)
    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //change the url without reload the page
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (e) {
    console.error(e, '🦁🦁🦁🦁');
    addRecipeView.renderError(e.message);
  }
};
const init = function () {
  //publisher-subscriber pattern
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
const newFeature = function () {
  console.log('welcome to the new application');
};
newFeature();
