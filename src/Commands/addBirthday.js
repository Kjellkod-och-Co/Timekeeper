const { SlashCommandBuilder } = require("@discordjs/builders");

const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
    name: 'get-all-birthdays',
    data: new SlashCommandBuilder()
      .setName("add-birthday")
      .setDescription("Add your birthday!")
      .addStringOption(op => {
        return op.setName('birthday').setDescription('Your birthday (1988-01-19)').setRequired(true);
      }),
    execute: async (interaction, client) => {
      const birthday = interaction.options.getString('birthday');
      const { data, error } = await supabase.from('birthdays').insert({ user: interaction.user.username, birthday: birthday });
      if (error) {
        console.log(error);
        return interaction.reply('Something went wrong');
      }
      return interaction.reply(`Your birthday has been added!`);
    },
  };