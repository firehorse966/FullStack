// js/script.js
import { getAuthUrl, getTokenFromUrl } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const homeBtn = document.getElementById('homeBtn');
  const favoritesBtn = document.getElementById('favoritesBtn');
  const playlistsBtn = document.getElementById('playlistsBtn');
  const mainContent = document.getElementById('mainContent');

  const tokenData = getTokenFromUrl();
  const token = tokenData.access_token;
  if (token) {
    localStorage.setItem('spotify_token', token);
    window.location.hash = '';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    initializePlayer(token);
    loadHome(); // Load home after login
  } else {
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      initializePlayer(storedToken);
      loadHome(); // Load home if token is already stored
    } else {
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
    }
  }

  loginBtn.addEventListener('click', () => {
    window.location.href = getAuthUrl();
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('spotify_token');
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    mainContent.innerHTML = '';
  });

  homeBtn.addEventListener('click', () => {
    loadHome();
  });

  favoritesBtn.addEventListener('click', () => {
    loadFavorites();
  });

  playlistsBtn.addEventListener('click', () => {
    loadPlaylists();
  });

  const loadHome = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    try {
      const response = await fetch('https://api.spotify.com/v1/browse/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      mainContent.innerHTML = '<h2>Categories</h2>';
      const gridContainer = document.createElement('div');
      gridContainer.className = 'grid-container';
      data.categories.items.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'grid-item';
        categoryDiv.innerHTML = `
          <img src="${category.icons[0].url}" alt="${category.name}" style="width: 100%; height: auto;">
          <h3>${category.name}</h3>
        `;
        categoryDiv.addEventListener('click', () => {
          loadCategoryPlaylists(category.id);
        });
        gridContainer.appendChild(categoryDiv);
      });
      mainContent.appendChild(gridContainer);
    } catch (error) {
      console.error('Error loading home:', error);
      mainContent.innerHTML = '<p>Failed to load categories. Please try again later.</p>';
    }
  };

  const loadCategoryPlaylists = async (categoryId) => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      const data = await response.json();
      mainContent.innerHTML = '<h2>Playlists</h2>';
      const gridContainer = document.createElement('div');
      gridContainer.className = 'grid-container';
      data.playlists.items.forEach(playlist => {
        const playlistDiv = document.createElement('div');
        playlistDiv.className = 'grid-item';
        playlistDiv.innerHTML = `
          <img src="${playlist.images[0].url}" alt="${playlist.name}" style="width: 100%; height: auto;">
          <h3>${playlist.name}</h3>
        `;
        playlistDiv.addEventListener('click', () => {
          loadPlaylistTracks(playlist.id);
        });
        gridContainer.appendChild(playlistDiv);
      });
      mainContent.appendChild(gridContainer);
    } catch (error) {
      console.error('Error loading playlists:', error);
      mainContent.innerHTML = '<p>Failed to load playlists. Please try again later.</p>';
    }
  };

  const loadPlaylistTracks = async (playlistId) => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }
      const data = await response.json();
      mainContent.innerHTML = '<h2>Tracks</h2>';
      const gridContainer = document.createElement('div');
      gridContainer.className = 'grid-container';
      data.items.forEach(item => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'grid-item';
        trackDiv.innerHTML = `
          <img src="${item.track.album.images[0].url}" alt="${item.track.name}" style="width: 100%; height: auto;">
          <p>${item.track.name}</p>
          <button class="play-btn">Play</button>
          <button class="fav-btn">Add to Favorites</button>
        `;
        trackDiv.querySelector('.play-btn').addEventListener('click', () => {
          playTrack(item.track.uri);
        });
        trackDiv.querySelector('.fav-btn').addEventListener('click', () => {
          addToFavorites(item.track.id);
        });
        gridContainer.appendChild(trackDiv);
      });
      mainContent.appendChild(gridContainer);
    } catch (error) {
      console.error('Error loading tracks:', error);
      mainContent.innerHTML = '<p>Failed to load tracks. Please try again later.</p>';
    }
  };

  const loadFavorites = async () => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch favorite tracks');
      }
      const data = await response.json();
      mainContent.innerHTML = '<h2>Favorites</h2>';
      const gridContainer = document.createElement('div');
      gridContainer.className = 'grid-container';
      data.items.forEach(item => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'grid-item';
        trackDiv.innerHTML = `
          <img src="${item.track.album.images[0].url}" alt="${item.track.name}" style="width: 100%; height: auto;">
          <p>${item.track.name}</p>
          <button class="play-btn">Play</button>
        `;
        trackDiv.querySelector('.play-btn').addEventListener('click', () => {
          playTrack(item.track.uri);
        });
        gridContainer.appendChild(trackDiv);
      });
      mainContent.appendChild(gridContainer);
    } catch (error) {
      console.error('Error loading favorite tracks:', error);
      mainContent.innerHTML = '<p>Failed to load favorite tracks. Please try again later.</p>';
    }
  };

  const playTrack = (trackUri) => {
    const token = localStorage.getItem('spotify_token');
    const deviceId = localStorage.getItem('spotify_device_id');
    if (!token || !deviceId) return;

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [trackUri] })
    }).then(response => {
      if (!response.ok) {
        alert('Failed to play track.');
      }
    });
  };

  const addToFavorites = (trackId) => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: [trackId] })
    }).then(response => {
      if (response.ok) {
        alert('Track added to favorites!');
      } else {
        alert('Failed to add track to favorites.');
      }
    });
  };

  const initializePlayer = (token) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        localStorage.setItem('spotify_device_id', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();
    };
  };

  // Initialize player if token is already stored
  const storedToken = localStorage.getItem('spotify_token');
  if (storedToken) {
    initializePlayer(storedToken);
  }
});