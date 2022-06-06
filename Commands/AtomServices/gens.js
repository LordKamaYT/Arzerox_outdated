// Dependencies
const CatLoggr = require('cat-loggr');

// Functions
const log = new CatLoggr();
const generated = new Set();

module.exports = {
	name: 'gen', // Command name
	description: 'Generate a specified service if stocked.', // Command description
    /**
     * Command exetute
     * @param {Message} message The message sent by user
     * @param {Array[]} args Arguments splitted by spaces after the command name
     */
	execute(message, args) {
        // If the generator channel is not given in config or invalid
        if (message.channel.id === "977916010692763668") {
            // If the user have cooldown on the command
            if (generated.has(message.author.id)) {
                    const test = new Discord.MessageEmbed()
                    .setColor(0x57F287)
                    .setTitle('Cooldown!')
                    .setDescription('Please wait before executing that command again!')
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                    message.channel.send(test)
            } else {
                // Parameters
                const service = args[0];

                // If the "service" parameter is missing
                if (!service) {
                    return message.channel.send(
                        new MessageEmbed()
                        .setColor(0x57F287)
                        .setTitle('Missing parameters!')
                        .setDescription('You need to give a service name!')
                        .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                        .setTimestamp()
                    );
                };
                
                // File path to find the given service
                const filePath = `${__dirname}/../stock/${args[0]}.txt`;

                // Read the service file
                fs.readFile(filePath, function (error, data) {
                    // If no error
                    if (!error) {
                        data = data.toString(); // Stringify the content

                        const position = data.toString().indexOf('\n'); // Get position
                        const firstLine = data.split('\n')[0]; // Get the first line

                        // If the service file is empty
                        if (position === -1) {
                            return message.channel.send(
                                new MessageEmbed()
                                .setColor(0x57F287)
                                .setTitle('Generator error!')
                                .setDescription(`I do not find the \`${args[0]}\` service in my stock!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };

                        // Send messages to the user
                        message.channel.send(
                            new MessageEmbed()
                            .setColor(0x57F287)
                            .setTitle('Generated account')
                            .addField('Service', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
                            .addField('Account', `\`\`\`${firstLine}\`\`\``, true)
                            .setTimestamp()
                        )
                        .then(message.author.send('Here is your copy+paste:'))
                        .then(message.channel.send(`\`${firstLine}\``));

                        // Send message to the channel if the user recieved the message
                        if (position !== -1) {
                            data = data.substr(position + 1); // Remove the gernerated account line
                            
                            // Write changes
                            fs.writeFile(filePath, data, function (error) {
                                message.channel.send(
                                    new MessageEmbed()
                                    .setColor(0x57F287)
                                    .setTitle('Account generated seccessfully!')
                                    .setDescription(`Check your private ${message.author}! *If you do not recieved the message, please unlock your private!*`)
                                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                    .setTimestamp()
                                );

                                generated.add(message.author.id); // Add user to the cooldown set

                                // Set cooldown time
                                setTimeout(() => {
                                    generated.delete(message.author.id); // Remove the user from the cooldown set after expire
                                }, config.genCooldown);

                                if (error) return log.error(error); // If an error occured, log to console
                            });
                        } else {
                            // If the service is empty
                            return message.channel.send(
                                new MessageEmbed()
                                .setColor(0x57F287)
                                .setTitle('Generator error!')
                                .setDescription(`The \`${args[0]}\` service is empty!`)
                                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                                .setTimestamp()
                            );
                        };
                    } else {
                        // If the service does not exists
                        return message.channel.send(
                            new MessageEmbed()
                            .setColor(0x57F287)
                            .setTitle('Generator error!')
                            .setDescription(`Service \`${args[0]}\` does not exist!`)
                            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                            .setTimestamp()
                        );
                    };
                });
            };
        } else {
            // If the command executed in another channel
            message.channel.send(
                new MessageEmbed()
                .setColor(0x57F287)
                .setTitle('Wrong command usage!')
                .setDescription(`You cannot use the \`gen\` command in this channel! Try it in <#${config.genChannel}>!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );
        };
	}
};