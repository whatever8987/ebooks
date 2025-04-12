import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider'; // Import slider
import { PlayerContext } from '../contexts/PlayerContext';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MiniPlayer = () => {
  const navigation = useNavigation();
  const {
      currentTrack,
      isPlaying,
      playPause,
      positionMillis,
      durationMillis,
      isPlayerVisible, // Use this to hide/show
      seek
    } = useContext(PlayerContext);

  if (!isPlayerVisible || !currentTrack) {
    return null; // Don't render if no track or explicitly hidden
  }

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  const openFullScreenPlayer = () => {
      navigation.navigate('Player'); // Navigate to the full screen player
  };

  // Basic drag handling (better libraries exist for smoother UX)
  const onSliderValueChange = (value) => {
      // Optional: Update UI optimistically while dragging
      // setPositionMillis(value * durationMillis);
  };

  const onSlidingComplete = (value) => {
      if(durationMillis > 0) {
          seek(value * durationMillis);
      }
  };


  return (
    <View style={styles.outerContainer}>
        {/* Progress Bar */}
        <Slider
            style={styles.progressBar}
            value={progress}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={COLORS.white} // Or accent
            maximumTrackTintColor={COLORS.grey}
            thumbTintColor="transparent" // Hide thumb for mini player progress
            disabled={true} // Make it non-interactive visually
            // onValueChange={onSliderValueChange} // Keep if you want interaction
            // onSlidingComplete={onSlidingComplete}
        />
        <TouchableOpacity style={styles.container} onPress={openFullScreenPlayer} activeOpacity={0.9}>
            <Image source={currentTrack.albumArt} style={styles.albumArt} />
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
            </View>
            {/* Like Button Placeholder */}
            <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="heart-outline" size={26} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={playPause} style={styles.controlButton}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={COLORS.text} />
            </TouchableOpacity>
        </TouchableOpacity>
     </View>
  );
};

const styles = StyleSheet.create({
   outerContainer: {
      position: 'absolute',
      bottom: 50, // Adjust based on your bottom tab bar height
      left: 0,
      right: 0,
      // backgroundColor: 'transparent', // Make outer transparent
   },
   progressBar: {
        width: '100%',
        height: 2, // Make progress bar very thin
        position: 'absolute',
        top: 0, // Position at the very top of the container
        padding: 0, margin: 0,
   },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey, // Background for the player bar itself
    paddingVertical: 8,
    paddingHorizontal: 15,
    // No border radius needed if it spans full width above tabs
    // If placed within screen content, add margin and borderRadius
    marginHorizontal: 5, // Small margin from screen edges
    borderRadius: 8,
    marginTop: 2, // Space for the progress bar above
    height: 60, // Fixed height
  },
  albumArt: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  controlButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default MiniPlayer;