import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; // parcel v2
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView.render(bookmarks, false))
      .join(''); //render is needed to fill previewView, with data, so it can generate markup with this._data. Furthermore, we don't add markups to the pages yet(thanks to "false")
  } // we do that, cause bookmarkVIew; resultsView has the same markup.
}
export default new bookmarksView();
