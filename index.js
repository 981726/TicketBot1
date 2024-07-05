const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token, guildId, helperRoleId, ownerId } = require('./config.json'); // Assuming you have these in a config file
const deployedCommands = require('./deploycmds');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', async () => {
    console.log('Ready!');

    // Deploy slash commands
    for (const command of deployedCommands) {
        const createdCommand = await client.guilds.cache.get(guildId)?.commands.create(command);
        console.log(createdCommand);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || interaction.commandName !== 'setupanel') return;

    const user = interaction.user;
    const embed = new EmbedBuilder()
        .setTitle("Buy - Zephy's Alt Control")
        .setDescription('Click the dropdown menu and select payment method.')
        .setThumbnail('https://media.discordapp.net/attachments/1258229579957407916/1258680066808873020/image0_0.jpg') // Replace with your image URL if needed
        .setFooter({
            text: 'Zephy Alt Control',
            iconURL: 'https://media.discordapp.net/attachments/1258229579957407916/1258680066808873020/image0_0.jpg'
        });

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Choose Your Payment Method')
                .addOptions([
                    { label: 'Robux', description: 'Click to buy with Robux', value: 'robux' },
                    { label: 'Nitro', description: 'Click to buy with Nitro', value: 'nitro' },
                    { label: 'Cashapp', description: 'Click to buy with Cashapp', value: 'cashapp' },
                    { label: 'Paypal', description: 'Click to buy with Paypal', value: 'paypal' },
                ]),
        );
    await interaction.channel.send({ embeds: [embed], components: [row] }); // Send embed message
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'select') return;

    const user = interaction.user;
    const guild = interaction.guild;
    const paymentMethod = interaction.values[0]; // Assuming only one value is selected

    // Create a private channel
    const channel = await guild.channels.create({
        name: `ticket-${user.username}`,
        type: 0, // 'GUILD_TEXT'
        permissionOverwrites: [
            {
                id: guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: helperRoleId,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: ownerId,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
        ],
    });

    const ticketEmbed = new EmbedBuilder()
        .setTitle(`Ticket for ${user.username}`)
        .setDescription(`Payment Method: ${paymentMethod}`)
        .setFooter({
            text: 'Zephy Alt Control',
            iconURL: 'https://media.discordapp.net/attachments/1258229579957407916/1258680066808873020/image0_0.jpg'
        });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close')
                .setLabel('🔒')
                .setStyle(ButtonStyle.Danger),
        );

    await channel.send({ content: `${user} Please wait until the owner comes and helps you out.`, embeds: [ticketEmbed], components: [row] });

    await interaction.reply({ content: 'Your ticket has been created.', ephemeral: true });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton() || interaction.customId !== 'close') return;

    const channel = interaction.channel;
    await channel.delete();
});

client.login(token);
