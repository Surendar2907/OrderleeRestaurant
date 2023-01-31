import React, {useRef, useState} from 'react';
import {View, Text, Image, Animated} from 'react-native';
import Styles from '../styles/Styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SCALE from './SCALE';
import {renderVegOrNonVegImage} from './SharedFunction';

const SuggestionSingleItem = ({
  id,
  title,
  price,
  description,
  image_src,
  isFavourite,
  isVeg,
  onSelectedDialogItem,
}) => {
  const scaleInAnimated = new Animated.Value(0);

  const openDialog = () => {
    onSelectedDialogItem(
      id,
      title,
      price,
      description,
      image_src,
      isFavourite,
      isVeg,
    );
  };

  return (
    <TouchableOpacity
      onPress={openDialog}
      onPressIn={() => {
        SCALE.pressInAnimation(scaleInAnimated);
      }}
      onPressOut={() => {
        SCALE.pressOutAnimation(scaleInAnimated);
      }}
      style={SCALE.getScaleTransformationStyle(scaleInAnimated)}>
      <Animated.View style={{width: 150, margin: 8}}>
        <Image
          source={{uri: image_src}}
          style={{
            width: '100%',
            height: 150,
            resizeMode: 'cover',
            borderRadius: 5,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            backgroundColor: '#ffffffD9',
          }}>
          <View
            style={{flexDirection: 'row', padding: 4, alignItems: 'center'}}>
            <Text
              style={[Styles.customFontVerySmall, {flex: 3, marginLeft: 4}]}>
              {title}
            </Text>
            {renderVegOrNonVegImage(isVeg)}
            <Image
              source={require('../../images/plus.png')}
              style={{
                width: 24,
                height: 24,
                marginLeft: 4,
                marginRight: 4,
                flex: 0.5,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SuggestionSingleItem;
