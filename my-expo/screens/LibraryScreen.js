import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { DUMMY_PLAYLISTS, DUMMY_TRACKS } from '../constants/dummyData'; // Assuming liked tracks are just tracks for now
import TrackItem from '../components/TrackItem'; // Re-use TrackItem
import MiniPlayer from '../components/MiniPlayer';
import { Ionicons } from '@expo/vector-icons'; // For icons

const LibraryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Playlists'); // Default tab

  const renderPlaylists = () => (
    <FlatList
      data={DUMMY_PLAYLISTS}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.playlistItem} onPress={() => console.log("Navigate to playlist:", item.id)}>
           <View style={styles.playlistImageContainer}>
              <Ionicons name={item.name === 'Liked Tracks' ? "heart" : "musical-notes"} size={24} color={COLORS.textSecondary} />
              {/* Or use item.image if you have specific images */}
               {/* <Image source={item.image} style={styles.playlistImage} /> */}
           </View>
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.playlistCount}>{item.trackCount} tracks</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>
      )}
       contentContainerStyle={styles.listPadding}
    />
  );

  const renderTracks = () => (
    <FlatList
      data={DUMMY_TRACKS} // Show all dummy tracks as 'Liked' for now
      keyExtractor={item => item.id}
      renderItem={({ item }) => <TrackItem track={item} onMoreOptions={() => console.log("More options for:", item.title)} />}
       contentContainerStyle={styles.listPadding}
    />
  );

   const renderContent = () => {
     switch(activeTab) {
       case 'Playlists': return renderPlaylists();
       case 'Tracks': return renderTracks();
       // Add cases for Artists, Downloads etc.
       default: return renderPlaylists();
     }
   };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Library</Text>
            {/* Add icons like Search or Add Playlist here if needed */}
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Ionicons name="search" size={24} color={COLORS.text} />
            </TouchableOpacity>
        </View>
      {/* Library Tabs */}
       <View style={styles.tabContainer}>
         {['Playlists', 'Tracks', 'Artists', 'Downloads'].map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
                 <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                 {activeTab === tab && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
         ))}
       </View>
       {renderContent()}
       <View style={{ height: 70 }} /> {/* Padding for MiniPlayer */}
       {/* <MiniPlayer /> */}
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
      paddingTop: 15, // Adjust as needed for status bar height
      paddingBottom: 10,
   },
   headerTitle: {
      color: COLORS.text,
      fontSize: 22,
      fontWeight: 'bold',
   },
   tabContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-around',
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.grey,
   },
   tabButton: {
       paddingHorizontal: 10,
       paddingVertical: 8,
       marginRight: 5,
       alignItems: 'center',
   },
   tabText: {
      color: COLORS.textSecondary,
      fontSize: 14,
      fontWeight: '500',
   },
   activeTabText: {
      color: COLORS.text,
   },
    activeTabIndicator: {
      height: 3,
      width: '70%', // Adjust width as needed
      backgroundColor: COLORS.accent,
      marginTop: 4,
      borderRadius: 2,
   },
   listPadding: {
       paddingBottom: 80, // Ensure space for MiniPlayer overlap
   },
   playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.grey,
   },
   playlistImageContainer: { // Use a container for icon or image
      width: 50,
      height: 50,
      borderRadius: 4,
      marginRight: 15,
      backgroundColor: COLORS.darkGrey,
      justifyContent: 'center',
      alignItems: 'center',
   },
   playlistImage: { // Style if using Image
      width: 50,
      height: 50,
      borderRadius: 4,
   },
   playlistInfo: {
      flex: 1,
   },
   playlistName: {
      color: COLORS.text,
      fontSize: 16,
      fontWeight: '500',
   },
   playlistCount: {
      color: COLORS.textSecondary,
      fontSize: 13,
      marginTop: 3,
   },
});

export default LibraryScreen;