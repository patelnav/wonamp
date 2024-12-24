# Wonamp

**W-O-N-A-M-P**

![Wonamp Logo](path-to-your-logo.png)

Welcome to **Wonamp**, a retro-inspired music playlist generator that combines the nostalgic look of WinAMP with modern web technologies. Easily create YouTube playlists by uploading images of song lists, using voice commands, or simply copying and pasting text. Whether you're reminiscing about the classic WinAMP interface or looking for a streamlined way to build your playlists, Wonamp has you covered.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
  - [Image Mode](#image-mode)
  - [Text Mode](#text-mode)
  - [Voice Mode](#voice-mode)
- [Components and Endpoints](#components-and-endpoints)
  - [Main UI](#main-ui)
  - [Server-Side Endpoints](#server-side-endpoints)
    - [Image Processing Endpoint](#image-processing-endpoint)
    - [YouTube Scraping Endpoint](#youtube-scraping-endpoint)
- [ID Generation](#id-generation)
- [Phase Development](#phase-development)
  - [Phase One: Image and Text Mode](#phase-one-image-and-text-mode)
  - [Phase Two: Voice Mode](#phase-two-voice-mode)
  - [Phase Two-B: Shareable Playlists](#phase-two-b-shareable-playlists)
  - [Phase Three: YouTube Account Integration](#phase-three-youtube-account-integration)
- [Future Improvements](#future-improvements)

## Features

- **Retro WinAMP Interface**: Enjoy a classic WinAMP look and feel with a modern twist.
- **Multiple Input Modes**:
  - **Image Mode**: Upload an image of a song list to automatically extract and process song titles.
  - **Text Mode**: Copy and paste a list of songs directly.
  - **Voice Mode**: (Upcoming) Use voice commands to list songs.
- **Automated YouTube Integration**:
  - **Unlisted YouTube Playlist**: Instantly generate an unlisted YouTube playlist with scraped video IDs.
  - **User Account Playlist**: (Phase Three) Create playlists directly in the user's YouTube account.
- **Responsive Design**: Mobile-optimized for seamless use on any device.
- **Customizable Playlists**: Easily manage and edit your generated playlists.

## Usage

### Image Mode

1. **Upload an Image**: Click on the "Upload Image" button and select a photo containing your song list.
2. **Process Image**: The app will use OCR powered by Grok to extract song titles from the image.
3. **Generate Playlist**: Automatically scrapes YouTube for each song and creates an unlisted YouTube playlist with the first search result.

### Text Mode

1. **Paste Song List**: Click on the "Text Mode" button and paste your list of songs in the designated area.
2. **Generate Playlist**: The app will process the text, scrape YouTube for each song, and create an unlisted YouTube playlist with the first search result.

### Voice Mode

_Coming Soon!_

1. **Activate Voice Mode**: Click on the "Voice Mode" button.
2. **List Songs**: Speak the names of the songs you want to add to your playlist.
3. **Generate Playlist**: The app will process your voice input, scrape YouTube, and create an unlisted YouTube playlist with the first search result.

## Components and Endpoints

### Main UI

The frontend is built with React and styled using Tailwind CSS to emulate the classic WinAMP interface. It includes:

- **Playlist Section**: Displays the list of songs with their corresponding YouTube links.
- **Control Buttons**: Buttons for uploading images, activating voice mode, and switching to text mode.

### Server-Side Endpoints

The backend, built with Next.js, handles the core functionalities through various endpoints.

#### Image Processing Endpoint

- **Endpoint**: `/api/process-image`
- **Functionality**:
  - Receives the uploaded image.
  - Utilizes Grok (G-R-O-K) LLM with an API key to perform OCR and extract song titles.
  - Returns a structured JSON array containing `artist` and `songTitle` for each song.
- **Example Response**:
  ```json
  [
    {
      "artist": "Artist Name",
      "songTitle": "Song Title"
    },
    ...
  ]
  ```

#### YouTube Scraping Endpoint

- **Endpoint**: `/api/search-youtube`
- **Functionality**:
  - Receives the list of songs from the image processing or text mode.
  - Performs web scraping to search YouTube for each song.
  - Retrieves the first search result for each song.
  - Generates a unique, short-form ID for each song.
  - Returns YouTube links associated with each song along with their IDs.
- **Example Response**:

```json
[
{
"id": "artistname-songtitle",
"artist": "Artist Name",
      "songTitle": "Song Title",
      "youtubeLink": "https://www.youtube.com/watch?v=example"
    },
    ...
  ]
```

ID Generation

To uniquely identify each song in the playlist while keeping the ID short, URL-compatible, and human-readable, we generate an ID based on the artist and song title. Here’s the algorithm used to create such IDs: 1. Concatenate Artist and Song Title: Combine the artist’s name and the song title with a hyphen.
Example: "Artist Name" + "Song Title" → "Artist Name-Song Title" 2. Normalize the String:

- Convert to Lowercase: Ensure consistency.
- "Artist Name-Song Title" → "artist name-song title"
- Remove Special Characters: Eliminate any characters that are not alphanumeric or hyphens.
- "artist name-song title" → "artistname-songtitle"
- Replace Spaces with Hyphens: Make the ID URL-friendly.
- "artistname-songtitle" remains as is if spaces are already handled.
- Truncate if Necessary: If the ID is too long, truncate to a reasonable length while preserving readability.
- "artistname-songtitle" (if longer, consider truncating parts)

Example Implementation in JavaScript:

```javascript
function generateSongID(artist, songTitle) {
  return `${artist}-${songTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .substring(0, 30); // Truncate to 30 characters
}

// Usage
const id = generateSongID("Artist Name", "Song Title");
// Result: "artistname-songtitle"
```

Considerations:

- Uniqueness: While combining artist and song title generally ensures uniqueness, consider adding a hash or incremental number if duplicates are possible.
- Length: Adjust the truncation length based on requirements. 30 characters is a balanced choice.
- Readability: Ensure that the ID remains human-readable by preserving the order and integrity of the artist and song title.

Enhanced Algorithm with Hash:

To further ensure uniqueness without compromising readability, we can append a short hash to the ID.

```javascript
const crypto = require("crypto");

function generateSongID(artist, songTitle) {
  const slug = `${artist}-${songTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens

  // Generate a short hash
  const hash = crypto
    .createHash("sha1")
    .update(slug)
    .digest("hex")
    .substring(0, 6);

  // Combine slug with hash
  return `${slug}-${hash}`;
}

// Usage
const id = generateSongID("Artist Name", "Song Title");
// Result: "artistname-songtitle-a1b2c3"
```

Advantages:

- Readability: The slug part is human-readable.
- Uniqueness: The appended hash reduces the risk of ID collisions.
- URL Compatibility: The entire ID is URL-friendly.

By implementing this approach, Wonamp can maintain clean, unique, and easily interpretable IDs for each song in the playlist.

# Phase Development

## Phase One: Image and Text Mode

In the initial phase, Wonamp will support:

- Image Mode: Users can upload images of song lists. The server processes these images using Grok to extract song information and scrapes YouTube to generate an unlisted playlist.
- Text Mode: Users can paste text lists of songs. The server processes the text to extract song information and scrapes YouTube to generate an unlisted playlist.

## Phase Two: Voice Mode

The upcoming phase will introduce:

- Voice Mode: Users can input song lists via voice commands. The server will process voice inputs using Grok, extract song information, scrape YouTube, and generate an unlisted playlist accordingly.

## Phase Two-B: Shareable Playlists

This phase introduces playlist sharing capabilities:

- [x] **Playlist Persistence**

  - [x] Set up KV store for permanent playlist storage
  - [x] Implement content-based playlist ID generation (same content = same ID)
  - [x] Create new `/api/playlists` endpoints:
    - [x] GET: Retrieve playlist by ID
    - [x] POST: Store playlist data (idempotent - won't create duplicates)

- [x] **Client-Side Integration**

  - [x] Add URL hash handling to store (#playlist-id)
  - [x] Implement playlist loading from hash on page load
  - [x] Add error display for invalid playlist IDs
  - [x] Update URL after playlist generation

- [ ] **Route Updates**
  - [x] Modify `/api/search-text` to store generated playlists
  - [x] Modify `/api/process-image` to store generated playlists
  - [x] Add error handling for invalid playlist IDs

## Phase Three: YouTube Account Integration

The final phase will focus on enhancing user experience by integrating directly with YouTube accounts:

- YouTube API Integration: Allow users to connect their YouTube accounts securely.
- Playlist Creation in User Account: Enable the app to create actual playlists within the user's YouTube account based on the provided song list.
- Authentication: Implement OAuth 2.0 to manage secure connections between Wonamp and YouTube.
- User Management: Allow users to view, edit, and manage their created playlists directly from Wonamp.

# Future Improvements

- Enhanced YouTube Scraping: Improve search accuracy by refining scraping algorithms to better identify official songs.
- User Authentication: Allow users to save and manage multiple playlists.
- Playlist Customization: Enable editing of playlists before finalizing.
- Integration with Other Platforms: Expand support to other music platforms like Spotify or Apple Music.
- Advanced OCR: Enhance image processing accuracy with better OCR models and error handling.
- Voice Mode Enhancements: Improve voice recognition accuracy and support for multiple languages.
- Analytics and Insights: Provide users with insights into their playlist creation trends and preferences.
