import { View, Text, StyleSheet } from 'react-native';
import './AbstractionExample.web.css';

export default function AbstractionExample() {
  return (
    <View style={styles.container}>
      <Text>I'm only on web devices :)</Text>
      <div className="old-fashioned-div">
        This is just an old fashioned div with some crazy css
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EDEDED',
    padding: 10,
  },
});
