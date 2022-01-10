let rating = "";
let result = {
  rating: 'pg_13',
  nsfw: 'white'  
}
if (result.rating) {
  rating += result.rating.toUpperCase().replace('_', '-');
}
if (result.nsfw) {
  rating += `\nNSFW: ` + result.nsfw.toUpperCase();
}
if (rating == "") {
  rating = 'Unknown';
}
console.log(`\`\`\`\n${rating}\`\`\``);