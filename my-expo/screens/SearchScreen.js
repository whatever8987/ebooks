import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { DUMMY_TRACKS } from '../constants/dummyData'; // Use dummy data for example results
import TrackItem from '../components/TrackItem';
import MiniPlayer from '../components/MiniPlayer';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]); // Initially empty

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      // Simulate searching dummy data
      const filtered = DUMMY_TRACKS.filter(
        track =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]); // Clear results if query is short
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for songs, artists, playlists..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoFocus={true} // Focus on screen load
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearIcon}>
             <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {results.length === 0 && searchQuery.length < 2 && (
        <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Find your favorite music.</Text>
             {/* Add recent searches or genre suggestions here */}
        </View>
       )}

        {results.length === 0 && searchQuery.length >= 2 && (
            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No results found for "{searchQuery}"</Text>
            </View>
        )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrackItem track={item} onMoreOptions={() => console.log("More options...")}/>}
         contentContainerStyle={styles.listPadding}
      />
      <View style={{ height: 70 }} /> {/* Padding for MiniPlayer */}
      {/* <MiniPlayer /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    margin: 15,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: COLORS.text,
    fontSize: 16,
  },
   clearIcon: {
     marginLeft: 10,
     padding: 5,
   },
   placeholderContainer: {
       flex: 1, // Take remaining space if no results
       justifyContent: 'center',
       alignItems: 'center',
   },
   placeholderText: {
       color: COLORS.textSecondary,
       fontSize: 16,
   },
   listPadding: {
       paddingBottom: 80, // Ensure space for MiniPlayer overlap
   }
});

export default SearchScreen;
