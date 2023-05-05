import icons from 'url:../../img/icons.svg'; // parcel v2
export default class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   * */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    //update specific part of the dom, compare dom objects

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup); //string->dom NODE object(like virtual dom element, it doesn't live on the page, but we can work with that)
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        // firstChild - display #text if there is some spaces,\n... we trim it and got ''. That happens if our div or whatever contains no only the text, but something another. But if there is only text we good to go
        // nodeValue- value of nodeValue will be null, if it is element, or other things. BUT if it a text, the result of the NodeValue=will be textValue
        curEl.textContent = newEl.textContent;
      //update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        // isEqualNode- compare content of the nodes
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    // 289. Rendering the Recipe
    const markup = `
   <div class='spinner'>
          <svg>
            <use href='${icons}#icon-loader'></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
