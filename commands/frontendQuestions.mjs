
import inquirer from "inquirer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chalk from "chalk";
import { saveProjectToLocalStorage, getProjectFromLocalStorage } from "../storage.mjs";
import ora from 'ora';
import { generationConfig } from "../config/index.mjs";
import dotenv from "dotenv";
const runtime = process;

dotenv.config();

// Generative AI client
const genAI = new GoogleGenerativeAI(runtime.env.GEN_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    console.log(chalk.green('No frontend framework selected'));

    console.log(`No frontend framework selected. Using project idea: ${loadedProject}`);

    // Generate files according to project Idea.
    const noFrameworkProject = await generateCode(loadedProject);
    console.log(noFrameworkProject);
    
}

async function generateCode(idea) {
    const spinner = ora('Generating content...').start();

    try {
        const result = await model.generateContent({
            contents: [{
                parts: [{
                    text: `Generate the required code files in html, css, and javascript for ${idea}. Be as precice and suggestive as possible. Skip explanation.`
                }]
            }],
            generationConfig
        });

        spinner.succeed('Content generated successfully');
        return result.response.text();
    } catch (error) {
        spinner.fail('Failed to generate content');
        throw error;
    }
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