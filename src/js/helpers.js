// 293. Helpers and Configuration Files
//And the goal of this file or of this module
// is to contain a couple of functions
// that we reuse over and over in our project.

import { API_URL } from './config';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', //thanks to that we said that the data thah we will be sending will be in json, so thanks to that api can accept that data correctly
          }, // headers are basically some snippets of text which are like information about the request itself.
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // return promise, wait for promise, get json object
    const data = await res.json(); // unpack json
    if (!res.ok) throw new Error(`${data.message} (${res.status}) 😿`);
    return data;
  } catch (err) {
    throw err; // by that promise from getjson will be rejected, otherwise it will be fullfilled
  }
};
/* modernised by new AJAX method
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // return promise, wait for promise, get json object
    const data = await res.json(); // unpack json
    if (!res.ok) throw new Error(`${data.message} (${res.status}) 😿`);
    return data;
  } catch (err) {
    throw err; // by that promise from getjson will be rejected, otherwise it will be fullfilled
  }
};
*/

//by the way, design patterns in programming
// are basically just standard solutions
// to certain kinds of problems.

//a publisher
// which is some code that knows when to react(addHandlerRender,because it will contain the addEventListener method.)

//a subscriber
// which is code that actually wants to react.So this is the code that should actually be executed
// when the event happens(controlRecipes).

// te solution is to pass into publisher subscriber function as an argument. all that we are doing when our program is loading

//So in summary, the handler subscribes to the publisher,
// which is the listener in this case,
// and then as the publisher publishes an event,
// the subscriber is executed.

/* modernised by new AJAX method
export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', //thanks to that we said that the data thah we will be sending will be in json, so thanks to that api can accept that data correctly
        }, // headers are basically some snippets of text which are like information about the request itself.
        body: JSON.stringify(uploadData),
      }),

      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json(); // unpack json
    if (!res.ok) throw new Error(`${data.message} (${res.status}) 😿`);
    return data;
  } catch (err) {
    throw err; // by that promise from getjson will be rejected, otherwise it will be fullfilled
  }
};
*/
