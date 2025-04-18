const { SlashCommandBuilder } = require('@discordjs/builders');

const setupPanelCommand = new SlashCommandBuilder()
    .setName('setuppanel')
    .setDescription('Sets up the payment panel.');

module.exports = [
    setupPanelCommand
];
