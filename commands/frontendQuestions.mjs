
import inquirer from "inquirer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
import { saveProjectToLocalStorage, getProjectFromLocalStorage } from "../storage.mjs";

/**
 * Handles the frontend framework selection and subsequent questions.
 *
 * @returns {void}
 */
export async function handleFrontendQuestions(project) {
    saveProjectToLocalStorage(project);
    whichFramework();
}

/**
 * Prompts the user to select a frontend framework.
 *
 * @returns {void}
 */
// Refactoring the switch-case block to a separate function

/**
 * Handles the frontend framework selection and subsequent questions.
 *
 * @returns {void}
 */
export async function whichFramework() {
    const response = await inquirer.prompt([
        {
            type: 'list',
            name: 'framework',
            message: 'Which framework do you want to use?',
            choices: ['React', 'Vue', 'Svelte', 'Angular', 'Ember', 'None']
        }
    ]);

    handleFrameworkSelection(response.framework);
}

/**
 * Handles the selected frontend framework.
 *
 * @param {string} framework - The selected frontend framework.
 * @returns {void}
 */
async function handleFrameworkSelection(framework) {
    switch (framework) {
        case 'React':
            reactQuestions();
            break;
        case 'Vue':
            vueQuestions();
            break;
        case 'Svelte':
            svelteQuestions();
            break;
        case 'Angular':
            angularQuestions();
            break;
        case 'Ember':
            emberQuestions();
            break;
        case 'None':
            noFramework();
            break;
    }
}

/**
 * Handles the case when no frontend framework is selected.
 *
 * @returns {void}
 */
async function noFramework() {
    const loadedProject = getProjectFromLocalStorage();
    console.log(chalk.bgGreen('No frontend framework selected'));
    console.log(`No frontend framework selected. Using project idea: ${loadedProject}`);
}
/**
 * Handles the questions related to React framework.
 * @returns {void}
 * This function is responsible for handling the questions related to React framework.
 * It logs a message indicating that React questions are being asked.
 *
 */
async function reactQuestions() {
    console.log('React questions');
}


async function vueQuestions() {
    console.log('Vue questions');
}


async function svelteQuestions() {
    console.log('Svelte questions');
}

async function angularQuestions() {
    console.log('Angular questions');
}

async function emberQuestions() {
    console.log('Ember questions');
}