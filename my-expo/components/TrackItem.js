import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { PlayerContext } from '../contexts/PlayerContext'; // Import context

const TrackItem = ({ track, onMoreOptions }) => {
  const { loadTrack, currentTrack, isPlaying } = useContext(PlayerContext); // Use context
  const isActive = currentTrack?.id === track.id;

  const handlePress = () => {
      if (!isActive) {
          loadTrack(track); // Load and play this track
      }
      // Optionally: if it IS active, navigate to full player? Or just let mini-player handle play/pause?
  };

  const formatDuration = (seconds) => {
    if (!seconds || typeof seconds !== 'number' || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={track.albumArt} style={styles.albumArt} />
      <View style={styles.infoContainer}>
        <Text style={[styles.title, isActive && styles.activeTitle]} numberOfLines={1}>{track.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
      </View>
      <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
      {isActive && isPlaying && (
           <MaterialCommunityIcons name="volume-high" size={20} color={COLORS.accent} style={styles.playingIcon} />
      )}
       {isActive && !isPlaying && (
           <MaterialCommunityIcons name="volume-medium" size={20} color={COLORS.textSecondary} style={styles.playingIcon} />
      )}
      <TouchableOpacity onPress={onMoreOptions} style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  albumArt: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1, // Takes up available space
    marginRight: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
  },
   activeTitle: {
    color: COLORS.accent, // Highlight active track title
    fontWeight: 'bold',
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  duration: {
    color: COLORS.textTertiary,
    fontSize: 13,
    minWidth: 40, // Ensure space
    textAlign: 'right',
  },
  playingIcon: {
      marginLeft: 10,
  },
  moreButton: {
    paddingLeft: 10, // Easier to tap
    paddingVertical: 5,
  },
});

export default TrackItem;