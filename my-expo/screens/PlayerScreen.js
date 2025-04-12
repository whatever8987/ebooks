import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerContext } from '../contexts/PlayerContext';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const PlayerScreen = ({ navigation }) => {
  const {
    currentTrack,
    isPlaying,
    playPause,
    seek,
    positionMillis,
    durationMillis,
    // Add skipNext, skipPrevious from context when implemented
  } = useContext(PlayerContext);

  if (!currentTrack) {
    // Optional: Show a placeholder or navigate back if no track is loaded
    return (
        <SafeAreaView style={styles.safeArea}>
             <View style={styles.container}>
                <Text style={styles.title}>No track loaded</Text>
             </View>
        </SafeAreaView>
    );
  }

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  const onSeek = (value) => {
      if(durationMillis > 0) {
          seek(value * durationMillis);
      }
  };

  return (
    <LinearGradient colors={[COLORS.darkGrey, COLORS.background, COLORS.background]} style={styles.safeArea}>
       <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Ionicons name="chevron-down" size={28} color={COLORS.text} />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Now Playing</Text>
           <TouchableOpacity onPress={() => console.log("More options...")} style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
           </TouchableOpacity>
        </View>

        <View style={styles.content}>
            <Image source={currentTrack.albumArt} style={styles.albumArt} />

            <View style={styles.trackInfo}>
                <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
            </View>

            {/* Progress Slider */}
            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    value={progress}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor={COLORS.white}
                    maximumTrackTintColor={COLORS.grey}
                    thumbTintColor={COLORS.white}
                    // onValueChange={value => { /* Can be used for live feedback */ }}
                    onSlidingComplete={onSeek} // Seek when user releases slider
                />
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
                    <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                 <TouchableOpacity style={styles.controlButton}>
                     <MaterialCommunityIcons name="shuffle-variant" size={26} color={COLORS.textSecondary} />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="play-skip-back" size={32} color={COLORS.text} />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={playPause} style={[styles.controlButton, styles.playPauseButton]}>
                    <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={70} color={COLORS.text} />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="play-skip-forward" size={32} color={COLORS.text} />
                 </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton}>
                     <MaterialCommunityIcons name="repeat" size={26} color={COLORS.textSecondary} />
                 </TouchableOpacity>
            </View>

            {/* Bottom Actions (Queue, Lyrics, etc.) */}
            <View style={styles.bottomActions}>
                 <TouchableOpacity style={styles.actionButton}>
                     <MaterialCommunityIcons name="playlist-music" size={24} color={COLORS.textSecondary} />
                     <Text style={styles.actionText}>Queue</Text>
                 </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                     <MaterialCommunityIcons name="text-to-speech" size={24} color={COLORS.textSecondary} />
                     <Text style={styles.actionText}>Lyrics</Text>
                 </TouchableOpacity>
                 {/* Add more like Share, Device */}
            </View>
        </View>
       </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 10, // Adjust for safe area if needed
  },
   headerTitle: {
      color: COLORS.text,
      fontSize: 16,
      fontWeight: '600',
   },
   iconButton: {
      padding: 5,
   },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-around', // Distribute space between elements
    paddingBottom: 20,
  },
  albumArt: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000", // Optional shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  artist: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10, // Adjust to align text with slider ends
     paddingHorizontal: 5, // Slight padding for text
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  controlButton: {
    padding: 10, // Make tap targets larger
  },
  playPauseButton: {
    marginHorizontal: 15, // Extra space around play/pause
  },
   bottomActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 15,
   },
   actionButton: {
       alignItems: 'center',
   },
    actionText: {
      color: COLORS.textSecondary,
      fontSize: 11,
      marginTop: 3,
   },
});

export default PlayerScreen;
