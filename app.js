// Initialize songs array from localStorage or use sample songs
let songs = JSON.parse(localStorage.getItem('songs')) || [
    {
        title: "Summer Vibes",
        artist: "John Doe",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8bXVzaWN8fHx8fHwxNjk4MjM5MDEw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Chill Mode",
        artist: "Jane Smith",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8bXVzaWN8fHx8fHwxNjk4MjM5MDEw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Deep Focus",
        artist: "Mike Johnson",
        cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8bXVzaWN8fHx8fHwxNjk4MjM5MDEw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  

];

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const progressBar = document.querySelector('.progress');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const playlist = document.getElementById('playlist');
const coverArt = document.getElementById('cover-art');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');

let currentSongIndex = 0;
let isPlaying = false;

// Initialize the player
function initPlayer() {
    // Load the first song
    loadSong(currentSongIndex);
    
    // Create playlist items
    songs.forEach((song, index) => {
        const playlistItem = createPlaylistItem(song, index);
        playlist.appendChild(playlistItem);
    });
}

// Load song
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.audio;
    coverArt.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    
    // Update playlist active state
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Play song
function playSong() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audioPlayer.play();
}

// Pause song
function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audioPlayer.pause();
}

// Previous song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Next song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update time displays
    currentTimeSpan.textContent = formatTime(currentTime);
    durationSpan.textContent = formatTime(duration);
}

// Format time to MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Set progress bar on click
function setProgress(e) {
    const progressArea = this.getBoundingClientRect();
    const clickX = e.clientX - progressArea.left;
    const duration = audioPlayer.duration;
    const newTime = (clickX / progressArea.width) * duration;
    audioPlayer.currentTime = newTime;
}

// Update volume
function updateVolume(e) {
    const volume = e.target.value / 100;
    audioPlayer.volume = volume;
    updateVolumeIcon(volume);
}

// Update volume icon based on level
function updateVolumeIcon(volume) {
    if (volume > 0.7) {
        volumeIcon.className = 'fas fa-volume-up';
    } else if (volume > 0.1) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-off';
    }
}

// Create playlist item element
function createPlaylistItem(song, index) {
    const playlistItem = document.createElement('div');
    playlistItem.className = 'playlist-item';
    playlistItem.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
    `;
    playlistItem.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
    });
    return playlistItem;
}

// Event listeners
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
volumeSlider.addEventListener('input', updateVolume);
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextSong);
document.querySelector('.progress-bar').addEventListener('click', setProgress);

// Toggle mute on volume icon click
volumeIcon.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.className = 'fas fa-volume-mute';
    } else {
        audioPlayer.volume = 1;
        volumeSlider.value = 100;
        volumeIcon.className = 'fas fa-volume-up';
    }
});

// Modal Elements
const addSongBtn = document.getElementById('add-song-btn');
const modal = document.getElementById('add-song-modal');
const closeModalBtn = document.getElementById('close-modal');
const addSongForm = document.getElementById('add-song-form');

// Show/Hide Modal
addSongBtn.addEventListener('click', () => {
    modal.classList.add('show');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    addSongForm.reset();
});

// Handle adding new song
addSongForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('song-title-input').value;
    const artist = document.getElementById('song-artist-input').value;
    const audioFile = document.getElementById('song-file-input').files[0];
    const coverFile = document.getElementById('song-cover-input').files[0];

    // Convert files to base64
    const audioBase64 = await fileToBase64(audioFile);
    const coverBase64 = await fileToBase64(coverFile);

    // Create new song object
    const newSong = {
        title,
        artist,
        audio: audioBase64,
        cover: coverBase64
    };

    // Add new song to array
    songs.push(newSong);
    
    // Save to localStorage
    localStorage.setItem('songs', JSON.stringify(songs));

    // Update playlist
    const playlistItem = createPlaylistItem(newSong, songs.length - 1);
    playlist.appendChild(playlistItem);

    // Close modal and reset form
    modal.classList.remove('show');
    addSongForm.reset();
});

// Helper function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Initialize the player when the page loads
window.addEventListener('load', initPlayer);
