import { View, Text, StyleSheet } from 'react-native';

export default function AbstractionExample() {
  return (
    <View style={styles.container}>
      <Text>I'm only on native devices :)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EDEDED',
    padding: 10,
  },
});
