import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    fontSize: 40,
  },
});

export default function App() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>
        You can build the nicest apps with React Native (web)
      </Text>
    </View>
  );
}
