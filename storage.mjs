// This file stores the project in local storage.

import { LocalStorage } from "node-localstorage";

let localStorage = new LocalStorage('./db');

// Check if local storage is available
if (typeof localStorage === 'undefined' || localStorage === null) {
    let localStorage = (typeof localStorage !== 'undefined' && localStorage !== null) ? localStorage : new LocalStorage('./db');

}

export function saveProjectToLocalStorage(project) {
    localStorage.setItem('project', JSON.stringify(project));
}

export function getProjectFromLocalStorage() {
    return JSON.parse(localStorage.getItem('project'));
}