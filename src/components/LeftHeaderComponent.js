import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {Animated, Image, Text, TouchableOpacity, View} from 'react-native';
import Modal, {ModalContent} from 'react-native-modals';
import {useGlobal, setGlobal} from 'reactn';
import Styles from '../styles/Styles';

const LeftHeaderComponent = (props) => {
  const navigation = useNavigation();
  const [count, setCount] = useGlobal('count');

  const [visible, setVisible] = useState(false);
  const [showSoundImg, setShowSoundImg] = useState(false);

  const shakeAnimation = new Animated.Value(0);

  useEffect(() => {
    startShake();
  }, [count]);

  function startShake() {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }

  const toggleDrawer = () => {
    setShowSoundImg(!showSoundImg);
    setGlobal({setVeg: !showSoundImg});
  };

  function renderImage() {
    var imgSource = showSoundImg
      ? require('../../images/veg_n.png')
      : require('../../images/non_veg_n.png');
    return (
      <Image
        source={imgSource}
        style={{width: 55, height: 55, marginRight: 4}}
      />
    );
  }

  const openCartScreen = () => {
    if (count == 0) {
      setVisible(true);
    } else {
      navigation.navigate('CartScreen');
    }
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => toggleDrawer()}>
          {renderImage()}
        </TouchableOpacity>
        <TouchableOpacity onPress={openCartScreen}>
          <Animated.View style={{transform: [{translateX: shakeAnimation}]}}>
            <Image
              source={require('../../images/cart_n.png')}
              style={{width: 40, height: 40, marginRight: 8}}
            />
          </Animated.View>

          <View
            style={{
              position: 'absolute',
              top: 5,
              left: 0,
              right: 10,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={Styles.customFontVerySmall}>{count}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        onTouchOutside={() => {
          setVisible(false);
        }}>
        <ModalContent
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../images/empty_cart.png')}
            style={{
              width: 150,
              height: 150,
              margin: 10,
              resizeMode: 'contain',
            }}
          />
          <Text style={Styles.customFontBig}>Oops!</Text>
          <Text style={Styles.customFontMedium}>Your cart is empty</Text>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default LeftHeaderComponent;
