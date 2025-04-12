import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const MusicCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ImageBackground source={item.image} style={styles.image} imageStyle={styles.imageStyle}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </LinearGradient>
         {/* Optional Play Button Overlay */}
         {/* <View style={styles.playButtonOverlay}>
           <Ionicons name="play-circle" size={40} color={COLORS.white} />
         </View> */}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 15,
    backgroundColor: COLORS.surface, // Fallback color
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
   imageStyle: {
    resizeMode: 'cover',
  },
  gradient: {
    padding: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
   playButtonOverlay: { // Optional: Center play button
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)' // Slight dimming
   }
});

export default MusicCard;