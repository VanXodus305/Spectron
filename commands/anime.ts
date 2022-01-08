import fetch from 'cross-fetch'
import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  category: "Test Commands",
  description: "Gives information about an anime from MyAnimeList",
  slash: 'both',
  testOnly: true,
  callback: async ({ client, interaction, message }) => {
    let embed = new MessageEmbed();
    
  }
} as ICommand

// fetch('https://api.myanimelist.net/v2/anime/30230?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics', {
//   method: "GET",
//   headers: {
//     "X-MAL-CLIENT-ID": "b3b3c7e51849afd6f2673f6e5176b066"
//   }
// })
//   .then(response => response.json()).then(json => console.log(json))
//   .catch(err => console.log(err));