import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS } from '../constants/colors';
import GenreChip from '../components/GenreChip'; // Reuse GenreChip
import { DUMMY_GENRES } from '../constants/dummyData'; // Use dummy genres
// You would need a dropdown/picker component for Country
// import RNPickerSelect from 'react-native-picker-select';

const AiPlaylistScreen = ({ navigation }) => {
  const [numTracks, setNumTracks] = useState(10);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [artistSeeds, setArtistSeeds] = useState('');
  const [trackSeeds, setTrackSeeds] = useState('');
  const [country, setCountry] = useState('US'); // Default or from user profile

  const [acousticness, setAcousticness] = useState(0.5); // Example 0-1 slider
  const [useAcousticness, setUseAcousticness] = useState(false);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre].slice(0, 5) // Limit to 5
    );
  };

  const handleGenerate = () => {
    console.log("Generating Playlist with:", {
      numTracks,
      country,
      genres: selectedGenres,
      artists: artistSeeds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5), // Basic parsing
      tracks: trackSeeds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5), // Basic parsing
      acousticness: useAcousticness ? acousticness : undefined,
    });
    // --- TODO: Call your backend API here ---
    // navigation.navigate('PlaylistDetail', { playlistId: 'newly_generated_id' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
       <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Generate Playlist with AI</Text>
            <View style={{width: 24}} />{/* Spacer */}
       </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Number of Tracks */}
        <Text style={styles.label}>Number of tracks to generate: {numTracks}</Text>
        <Slider
          style={styles.slider}
          value={numTracks}
          minimumValue={5}
          maximumValue={50}
          step={1}
          minimumTrackTintColor={COLORS.accent}
          maximumTrackTintColor={COLORS.grey}
          thumbTintColor={COLORS.accent}
          onValueChange={setNumTracks}
        />

        {/* Country Selector (Placeholder) */}
        <Text style={styles.label}>Country</Text>
         <TouchableOpacity style={styles.input} onPress={() => alert("Country Picker Needed!")}>
             <Text style={{color: COLORS.text}}>{country} (United States)</Text>
             <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
         </TouchableOpacity>
        {/* Use RNPickerSelect or similar here */}


        {/* Genres */}
        <Text style={styles.label}>Select up to 5 Genres</Text>
        <View style={styles.chipContainer}>
          {DUMMY_GENRES.map(genre => (
            <GenreChip
              key={genre}
              genre={genre}
              isSelected={selectedGenres.includes(genre)}
              onPress={toggleGenre}
            />
          ))}
        </View>

        {/* Artist Seeds */}
        <Text style={styles.label}>Seed Artists (up to 5, comma-separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., The Weeknd, Queen, ..."
          placeholderTextColor={COLORS.textTertiary}
          value={artistSeeds}
          onChangeText={setArtistSeeds}
        />

        {/* Track Seeds */}
        <Text style={styles.label}>Seed Tracks (up to 5, comma-separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Blinding Lights, Bohemian Rhapsody, ..."
          placeholderTextColor={COLORS.textTertiary}
          value={trackSeeds}
          onChangeText={setTrackSeeds}
        />

        {/* Optional Parameters */}
        <View style={styles.switchRow}>
            <Text style={styles.label}>Target Acousticness</Text>
            <Switch
                trackColor={{ false: COLORS.grey, true: COLORS.accent }}
                thumbColor={useAcousticness ? COLORS.white : COLORS.textSecondary}
                ios_backgroundColor={COLORS.grey}
                onValueChange={setUseAcousticness}
                value={useAcousticness}
            />
        </View>
        {useAcousticness && (
             <>
                 <View style={styles.acousticnessLabels}>
                    <Text style={styles.acousticnessText}>Low</Text>
                    <Text style={styles.acousticnessText}>Medium</Text>
                    <Text style={styles.acousticnessText}>High</Text>
                 </View>
                 <Slider
                    style={styles.slider}
                    value={acousticness}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    minimumTrackTintColor={COLORS.accent}
                    maximumTrackTintColor={COLORS.grey}
                    thumbTintColor={COLORS.accent}
                    onValueChange={setAcousticness}
                />
             </>
        )}


        {/* Generate Button */}
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>Generate Playlist</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.surface,
   },
   headerTitle: {
      color: COLORS.text,
      fontSize: 17,
      fontWeight: '600',
   },
   iconButton: {
      padding: 5,
   },
  container: {
    flex: 1,
  },
   contentContainer: {
    padding: 20,
    paddingBottom: 40, // Extra space at the bottom
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 15,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 15,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 15,
    // For Picker placeholder
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 45, // Ensure consistent height
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  acousticnessLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5, // Align with slider ends
  },
  acousticnessText: {
      color: COLORS.textTertiary,
      fontSize: 12,
  },
  generateButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  generateButtonText: {
    color: COLORS.black, // Or white depending on accent
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AiPlaylistScreen;