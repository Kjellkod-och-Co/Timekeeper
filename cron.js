const cron = require('node-cron');
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
// const { token } = require('./config.json');
const { createClient } = require('@supabase/supabase-js');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const token = process.env.D_TOKEN;

// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// When the client is ready, run this code (only once)
client.once('ready', async  (c)  => {
    
    const serverId = process.env.SERVER_ID;
    const TEST_channelId = process.env.TESTING_CHANNEL;
    const channelId = process.env.CHANNEL_ID;
    const server = client.guilds.cache.get(serverId);
    if (!server) {
        console.log("Server not found && BOT does not have access");
    }

    const channel = server.channels.cache.get(channelId);
    if (!channel || channel.type !== "text") {
        console.log("Channel not found && BOT does not have access to the server" + channelId);
    }
    console.log(`Ready! Logged in as ${c.user.tag}`);
    console.log("Running a job every day at 10:00 AM");
    cron.schedule("0 10 * * *", async () => { // 0 9 * * * = Every day at 09:00 AM // */10 * * * * * // 0 10 * * *
        async function getBirthday() {
            let element = undefined;
            let { data: birthdays, e } = await supabase.from("birthdays").select("birthday");
            let { data: user, r } = await supabase.from("birthdays").select("user");

            const users = user.map((user) => user);

            function getDataFromSupabase(users, birthdays) {
                var result = [];
                for (var i = 0; i < users.length; i++) {
                    result.push(users[i].user, birthdays[i].birthday);
                }
                return result;
            }
            function transformArrayToObject(array) {
                const transformedArray = [];
                for (let i = 0; i < array.length; i += 2) {
                    const user = array[i];
                    const birthday = array[i + 1];
                    transformedArray.push({ user, birthday });
                }

                return transformedArray;
            }
            const newArray = transformArrayToObject(getDataFromSupabase(users, birthdays));
            const today = moment().format("MM-DD");

            function printCombinedData(dataArray) {
                for (const item of dataArray) {
                    let { user, birthday } = item;
                    birthday = moment(birthday).format("MM-DD");                    
                    if (birthday === today) {
                        channel.send(`Hurra Hurrah! @everyone, ${user} har en födelsedag idag!, Birthday: ${birthday}. Hoppas ni får en fantastisk dag! från oss på servern!`);                        
                    }
                }
            }

            printCombinedData(newArray);



        
        } // End of getBirthday function (async)
        getBirthday();
    });
});



// Log in to Discord with your client's token
client.login(token);

// * Every day this job is run...
const everyDay = async () => {
    console.log('------------------------------------');
    console.log("Running a job every day at 10:00 AM");
    console.log('------------------------------------');
    
};


module.exports = everyDay;
