// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  minting_status: 'not_started', //not_started | phase_whitelist | stoped
  token: 'jdjaosiij28892SIAHI049923701CIGknlklajal',
  mainsiteUrl: 'https://www.avatizer.art',
  openseaUrl: 'https://opensea.io/collection/avatizer',
  twitterUrl: 'https://twitter.com/Avatizer_NFT',
  discordUrl: 'https://discord.gg/avatizer',
  siteName: 'Avatizer',
  contractAv: '0x9DC9Ccd5C99BE3478a261E90b2C1746C2eB9612E',
  walletconnect_infuraId: '5cefff2052fb40bd93b90658d9949089', //'68bbfa6dd6594f328012419c5b654b2f',//'5cefff2052fb40bd93b90658d9949089',
  minting_date_start: 'Tue, Oct 18, 2022 @ 11:00 AM EST (NYC Time)',
  moralis_api_key:'8kEmud1tbZttJ6IZdoVSejGjUt4NXlbJXjLqEu5HsjRezZYkXZv1pEX6BslaWQ8T',
  network:'goerli'    
};

/*
minting_status: 'not_start' - You are a bit early, minting will start soon.
minting_status: 'start' - mint is started
minting_status: 'paused' - 'You are a bit early, minting will start soon.'
minting_status: 'start2' - mint 2 is started
minting_status: 'stop' - SOLD OUT
*/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

