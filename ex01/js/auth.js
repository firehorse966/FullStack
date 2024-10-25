
// js/auth.js
const clientId = 'e66df68a70cb46a7aa0e4abae1ddb529'; // Replace with your actual Spotify Client ID
const redirectUri = 'http://localhost:5500'; // Ensure this matches the redirect URI registered in Spotify Developer Dashboard
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'user-library-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-library-modify'
];

export const getAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=token&show_dialog=true`;
};

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};