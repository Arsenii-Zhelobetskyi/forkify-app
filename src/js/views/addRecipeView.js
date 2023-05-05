import View from './View';
import icons from 'url:../../img/icons.svg'; // parcel v2
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'recipe was successfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    //to use addHandlerSHowWindow method not in the controller
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _addHandlerShowWindow() {
    // we want to call that function as soon as program starts, but it doesn't really need to be in the controller(it doesn't manipulate with different views, doesn't do somethings with the model).
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // setted this to the object, otherwise it will still be the button
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)]; // to select all forms in one move, we should pass into it form
      //   And so this will then basically give us an array,
      // which contains all the fields with all the values in there.
      // console.log(data); // this data we will use to publish into our api, we will do that in the model, so now we need a controller
      const data = Object.fromEntries(dataArray); // array into object, cause it more handy, and our recipe is basically always is object, oposite to entries()
      handler(data);
    });
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
