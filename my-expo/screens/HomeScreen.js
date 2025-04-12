import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';
import { DUMMY_FEATURED, DUMMY_RELEASES } from '../constants/dummyData';
import MusicCard from '../components/MusicCard';
import MiniPlayer from '../components/MiniPlayer'; // Import MiniPlayer

const HomeScreen = ({ navigation }) => {
  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <MusicCard item={item} onPress={() => console.log("Navigate to playlist/album:", item.id)} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
       <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container}>
        {/* Simple Tab Placeholder */}
        <View style={styles.tabContainer}>
          <Text style={[styles.tab, styles.activeTab]}>Personalized</Text>
          <Text style={styles.tab}>Genre</Text>
        </View>

        {renderSection('Featured', DUMMY_FEATURED)}
        {renderSection('New Releases', DUMMY_RELEASES)}

        {/* Add more sections as needed */}
         <View style={{ height: 80 }} /> {/* Add padding at the bottom for MiniPlayer */}
      </ScrollView>
      {/* MiniPlayer sits on top of the ScrollView content */}
       {/* <MiniPlayer /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  tab: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
    paddingBottom: 5, // Space for potential underline
  },
  activeTab: {
    color: COLORS.text,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 15,
  },
   listContentContainer: {
    paddingLeft: 15, // Start list items with padding
    paddingRight: 5, // Ensure last item margin is visible
  },
});

export default HomeScreen;