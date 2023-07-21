const { SlashCommandBuilder } = require("@discordjs/builders");

const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = {
    name: 'get-all-birthdays',
    data: new SlashCommandBuilder()
      .setName("get-birthdays")
      .setDescription("Get all birthdays!"),
    execute: async (interaction, client) => {
      const { data, error } = await supabase.from('birthdays').select('');
      if (error) {
        console.log(error);
        return interaction.reply('Something went wrong');
      }
      const birthdays = data.map((birthday) => birthday.birthday);
      const users = data.map((birthday) => birthday.user);
      
      function combineData(users, birthdays) {
        var result = [];
        for (var i = 0; i < users.length; i++) {
          result.push('User: ' + users[i] + " " + 'Birthday: ' + birthdays[i]);
        }
        return result;
      }
      return interaction.reply(`${combineData(users, birthdays)}`);
    }
  };