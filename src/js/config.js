// 293. Helpers and Configuration Files
//here into this file,
// we will basically put all the variables
// that should be constants
// and should be reused across the project.
//And the goal of having this file with all these variables
// is that it will allow us to easily configure
// or project by simply changing some of the data
// that is here in this configuration file.

//The only variables that we do want here
// are the ones that are responsible
// for kind of defining some important data
// about the application itself.
export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10; // so it also will help to understand our code, if we just write 10 sec in method, it will be hard to understand why that number is appeared, but with that it easier
export const RES_PER_PAGE = 10;
export const KEY = 'cb554dee-9fd4-4c25-b748-88b420a10dd0';
export const MODAL_CLOSE_SEC = 3.5;
