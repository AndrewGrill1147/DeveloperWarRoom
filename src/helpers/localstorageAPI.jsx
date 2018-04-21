/* global localStorage */

class LocalStorageAPI {
    static put(key, value) {
        if(typeof key !== 'string' || typeof value !== 'object') {
            return;
        }
        localStorage.setItem(key, JSON.stringify(value))
    }

    static get(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}

export default LocalStorageAPI;