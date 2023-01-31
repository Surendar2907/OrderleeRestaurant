import React, {useState, useEffect} from 'react';
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Styles from '../../styles/Styles';

const EmptyDataScreen = ({title, description}) => {
  useEffect(() => {
    scaleAnim();
  }, []);

  let scaleValue = new Animated.Value(0);
  const cardScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.2],
  });

  function scaleAnim() {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scale: cardScale}],
      }}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../../images/empty_cart.png')}
          style={{
            width: 120,
            height: 120,
            resizeMode: 'contain',
          }}
        />
        <Text style={Styles.customFontBig}>{title}!</Text>
        <Text style={Styles.customFontMedium}>{description}</Text>
      </View>
    </Animated.View>
  );
};

export default EmptyDataScreen;
