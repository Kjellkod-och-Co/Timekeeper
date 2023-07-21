const { SlashCommandBuilder } = require("@discordjs/builders");

const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
    data: new SlashCommandBuilder()
      .setName("remove-birthday")
      .setDescription("Remove your birthday!"),
    execute: async (interaction, client) => {
      const { data, error } = await supabase.from('birthdays').delete().match({ user: interaction.user.username });
      if (error) {
        console.log(error);
        return interaction.reply('Something went wrong');
      }
      return interaction.reply(`Your birthday has been removed!`);
    }
  };