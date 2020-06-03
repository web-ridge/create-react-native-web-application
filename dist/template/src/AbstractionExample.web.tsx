import * as React from 'react';
import { View, Text } from 'react-native';
import './AbstractionExample.web.css';

export default function AbstractionExample() {
  return (
    <View style={{ backgroundColor: '#EDEDED', padding: 10 }}>
      <Text>I'm only on web devices :)</Text>
      <div className="old-fashioned-div">
        This is just an old fashioned div with some crazy css
      </div>
    </View>
  );
}
