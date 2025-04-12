import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const GenreChip = ({ genre, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected ? styles.selectedChip : styles.unselectedChip]}
      onPress={() => onPress(genre)}
    >
      <Text style={[styles.text, isSelected ? styles.selectedText : styles.unselectedText]}>
        {genre}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8, // For wrapping
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  unselectedChip: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.grey,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  selectedText: {
    color: COLORS.black, // Or white depending on accent color
  },
  unselectedText: {
    color: COLORS.textSecondary,
  },
});

export default GenreChip;