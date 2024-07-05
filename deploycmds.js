const { SlashCommandBuilder } = require('@discordjs/builders');

// Define your slash commands using SlashCommandBuilder
const setupPanelCommand = new SlashCommandBuilder()
    .setName('setuppanel')
    .setDescription('Sets up the payment panel.');

// Export the array of slash commands
module.exports = [
    setupPanelCommand
];
