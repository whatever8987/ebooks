// contexts/PlayerContext.js
import React, { createContext, useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { DUMMY_TRACKS } from '../constants/dummyData';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false); // For full screen player

  const soundRef = useRef(null); // Use ref to avoid stale closure issues

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true, // Basic background audio
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    // Load initial track maybe? Or wait for user action.
    // loadTrack(DUMMY_TRACKS[0]); // Example: Load first track on startup
  }, []);

  useEffect(() => {
    soundRef.current = sound; // Keep ref updated
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish && !status.isLooping) {
        // Handle track finish - e.g., play next?
        setIsPlaying(false);
        // setPositionMillis(0); // Reset position
        // Maybe load next track here
      }
    } else {
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
        // Handle error appropriately
      }
    }
  };

  const loadTrack = async (track) => {
     console.log("Loading track:", track);
    if (!track) return;

    if (soundRef.current) {
        console.log("Unloading previous sound");
        await soundRef.current.unloadAsync();
        setSound(null); // Clear state immediately
        soundRef.current = null;
    }


    setIsPlayerVisible(true); // Show mini-player when a track is loaded
    setCurrentTrack(track);
    setPositionMillis(0);
    setDurationMillis(track.duration ? track.duration * 1000 : 0); // Use provided duration if available

    try {
        console.log("Attempting to load new sound...");
        // --- Simulate network delay ---
        // await new Promise(resolve => setTimeout(resolve, 500));
        // --- ---

        // NOTE: For local files use track.source or similar
        // For streaming, use { uri: track.streamUrl }
        // This example assumes a local file for simplicity
        // Replace with actual source URI when integrating backend
        const { sound: newSound, status } = await Audio.Sound.createAsync(
           // DUMMY: Using a known playable source for testing
           // Replace with track.uri or similar when you have actual URIs
           // require('../assets/sample.mp3'), // Make sure you have a sample mp3
           { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Test URI
           { shouldPlay: true }, // Start playing immediately
           onPlaybackStatusUpdate
        );
         console.log("Sound loaded, status:", status.isLoaded);
        setSound(newSound); // Update state *after* successful load
        setIsPlaying(true);

    } catch (error) {
        console.error('Error loading track:', error);
        setCurrentTrack(null); // Reset if loading failed
        setIsPlayerVisible(false);
    }
  };

  const playPause = async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
           console.log("Paused");
        } else {
          await soundRef.current.playAsync();
           console.log("Playing");
        }
        // No need to setIsPlaying here, onPlaybackStatusUpdate handles it
      }
    } catch (error) {
      console.error('Error playing/pausing track:', error);
    }
  };

 const seek = async (millis) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(millis);
      setPositionMillis(millis); // Optimistically update UI
       console.log("Seeked to:", millis);
    } catch (error) {
      console.error('Error seeking track:', error);
    }
  };

  // Add skipNext, skipPrevious logic here later

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        positionMillis,
        durationMillis,
        isPlayerVisible, // Expose visibility
        loadTrack,
        playPause,
        seek,
        setIsPlayerVisible, // Allow modifying visibility (e.g., closing full player)
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};