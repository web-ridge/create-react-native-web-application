import * as React from 'react';
import { View, Text } from 'react-native';

export default function AbstractionExample() {
  return (
    <View style={{ backgroundColor: '#EDEDED', padding: 10 }}>
      <Text>I'm only on web devices :)</Text>
    </View>
  );
}
