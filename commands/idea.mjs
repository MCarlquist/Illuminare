import chalk from "chalk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import inquirer from "inquirer";
import ora from 'ora';
import dotenv from 'dotenv';
import { handleFrontendQuestions } from "./frontendQuestions.mjs";
import { handleBackendQuestions } from "./backendQuestions.mjs";
dotenv.config();
const runtime = process;

// Generative AI client
const genAI = new GoogleGenerativeAI(runtime.env.GEN_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
        temperature: 0.7,
        topK: 40,
        maxOutputTokens: 1024,
};

/**
 * Initializes the Illuminare application and starts the project idea generation process.
 */
export async function Init() {
    console.log(chalk.blue("Welcome to Illuminare!"));
    getProjectIdea();
}

/**
 * Manages the process of getting a project idea, generating content, and displaying it for confirmation.
 */
async function getProjectIdea() {
    const idea = await getProjectPrompt();
    const generatedContent = await generateContent(idea);
    await displayAndConfirmIdea(generatedContent);
}

/**
 * Refines the project idea based on user input and generates updated content.
 * @param {string} idea - The original project idea
 */
async function fineTuneProjectPrompt(idea) {
    
    const finetune = await interactWithAIPrompt('Ok, what should we change?', 'fineTuneProject');
    
    const result = await model.generateContent({
        contents: [{
            parts: [{
                text: `As an expert programmer, ${idea} to the specifications in ${finetune.fineTuneProject}.
                Focus on providing detailed technical specifications and suggestions for implementation.`
            }]
        }],
        generationConfig
    })
        .then(response => {
            return response;
        })
        .catch(error => {
            throw error;
        });

    const project = result.response.text();
    console.log(project);
};

/**
 * Prompts the user for input and returns the formatted response.
 * @param {string} message - The prompt message
 * @param {string} name - The name of the input field
 * @returns {Object} The formatted user response
 */
async function interactWithAIPrompt(message = '', name = '') {
    const response = await inquirer.prompt([
        {
            type: 'input',
            name,
            message: `${message}`,
        }
    ]);

    const formattedResponse = {};
    Object.entries(response).forEach(([key, value]) => {
        formattedResponse[key] = value;
    });
    return formattedResponse;
}

/**
 * Prompts the user for a project idea.
 * @returns {Object} The user's project idea
 */
async function getProjectPrompt() {
    return await interactWithAIPrompt('What kind of project do you want to create? (What are you in the mood for?)', 'projectIdea');
}

/**
 * Generates content based on the given project idea using the AI model.
 * @param {Object} idea - The project idea
 * @returns {string} The generated content
 */
async function generateContent(idea) {
    const spinner = ora('Generating content...').start();
    try {
        const result = await model.generateContent({
            contents: [{
                parts: [{
                    text: `As an expert programmer, ${idea.projectIdea}. 
                    Focus on providing detailed technical specifications and suggestions for implementation. It should be language agnostic but easy to be understood by any developer.`
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
 * Displays the generated project idea and prompts the user for confirmation.
 * @param {string} project - The generated project idea
 */
async function displayAndConfirmIdea(project) {
    console.log(project);
    const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: `Does this idea look good?`,
    }]);

    if (confirm) {
        await handleConfirmedIdea(project);
    } else {
        await handleRejectedIdea(project);
    }
}

/**
 * Handles the flow when the user confirms the project idea.
 * @param {string} project - The confirmed project idea
 */
async function handleConfirmedIdea(project) {
    const { frontOrBackend } = await inquirer.prompt({
        type: 'list',
        name: 'frontOrBackend',
        message: 'Is this a frontend or backend project?',
        choices: ['Frontend', 'Backend']
    });

    console.log(`Ok a ${frontOrBackend} project`);
    if (frontOrBackend === 'Frontend') {
        await handleFrontendQuestions(project);
    } else {
        await handleBackendQuestions();
    }
}

/**
 * Handles the flow when the user rejects the project idea.
 * @param {string} project - The rejected project idea
 */
async function handleRejectedIdea(project) {
    const { fineTuneProject } = await inquirer.prompt({
        type: 'list',
        name: 'fineTuneProject',
        message: 'Ok, what should we change?',
        choices: ['Start from the beginning', 'Fine tune project idea'],
    });

    if (fineTuneProject === 'Start from the beginning') {
        await getProjectIdea();
    } else {
        await fineTuneProjectPrompt(project);
    }
}