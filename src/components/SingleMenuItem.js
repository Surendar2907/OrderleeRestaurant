import React, {useRef, useState} from 'react';
import {View, Text, Image, ImageBackground} from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import {setGlobal, useGlobal} from 'reactn';
import {useEffect} from 'react';
import Styles from '../styles/Styles';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {renderVegOrNonVegImage} from './SharedFunction';

const SingleMenuItem = ({
  id,
  title,
  price,
  description,
  image_src,
  isFavourite,
  isVeg,
}) => {
  const [value, setValue] = useState(0);
  const [count, setCount] = useGlobal('count');
  const [list, setList] = useGlobal('list');
  const [data, setData] = useGlobal('Data');
  const [displayDescription, setDisplayDescription] = useState('none');
  const [favouriteImage, setfavouriteImage] = useState(isFavourite);
  useEffect(() => {
    checkCountValue();
  }, [list]);

  function checkCountValue() {
    if (list.length > 0) {
      var index = list.findIndex((x) => x.id === id);
      if (index !== -1) {
        setValue(list[index].count);
      }
    } else {
      setValue(0);
    }
  }

  // const [ state, dispatch ] = useGlobal(reducer);

  // const reset = () => dispatch({ type: 'reset' });
  // const increment = () => dispatch({ type: 'increment' });
  // const decrement = () => dispatch({ type: 'decrement' });

  const updateFromKeyboard = (num) => {
    setValue(num);
    if (list.length === 0) {
      setList([{id: id, count: num}]);
    } else {
      updateItem(id, {count: num});
    }
  };

  function updateItem(id, itemAttributes) {
    var index = list.findIndex((x) => x.id === id);
    if (index === -1) {
      // handle error
      setList([...list, {id: id, count: itemAttributes.count}]);
    } else {
      setList([
        ...list.slice(0, index),
        Object.assign({}, list[index], itemAttributes),
        ...list.slice(index + 1),
      ]);
    }
  }

  const toggleDrawer = () => {
    var index = data.findIndex((x) => x.id === id);
    let newArr = [...data];
    newArr[index].isFavourite = !favouriteImage;
    setData(newArr);
    setfavouriteImage(!favouriteImage);
  };

  const renderFavouriteImage = () => {
    var imgSource = favouriteImage
      ? require('../../images/fav_sel.png')
      : require('../../images/fav.png');
    return (
      <Image
        source={imgSource}
        style={{
          width: 24,
          height: 24,
          marginLeft: 4,
          flex: 0.5,
          resizeMode: 'contain',
        }}
      />
    );
  };

  const increment = () => {
    if (value < 10) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (value > 0) {
      setCount(count - 1);
    }
  };

  const showDescription = () => {
    setDisplayDescription(displayDescription === 'none' ? 'flex' : 'none');
  };

  return (
    <View style={{alignItems: 'center', margin: 15}}>
      {/* <Card style={{ margin: 10, elevation: 2, cornerRadius: 5, opacity: 1 }}>

        
      </Card> */}

      <ImageBackground
        source={{uri: image_src}}
        style={{
          width: '100%',
          height: 200,
          resizeMode: 'cover',
        }}>
        <TouchableOpacity style={{height: '100%'}} onPress={showDescription}>
          <View
            style={{
              display: displayDescription,
              height: '80%',
              backgroundColor: '#ffffffD9',
              justifyContent: 'center',
              padding: 24,
            }}>
            <Text style={[Styles.customFontNormal]}>{description}</Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            padding: 5,
            flexDirection: 'row',
            backgroundColor: '#ffffffD9',
            alignItems: 'center',
            paddingVertical: 6,
          }}>
          <Text style={[Styles.customFontNormal, {flex: 4}]}>{title}</Text>
          <Text style={[Styles.customFontNormal, {flex: 2}]}>EGP {price}</Text>
          {renderVegOrNonVegImage(isVeg)}
          <TouchableOpacity onPress={() => toggleDrawer()}>
            {renderFavouriteImage()}
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <InputSpinner
        style={{width: 200, padding: 5}}
        max={10}
        min={0}
        step={1}
        color={'#00000000'}
        rounded={false}
        editable={false}
        buttonFontSize={15}
        value={value}
        onChange={(num) => {
          updateFromKeyboard(num);
        }}
        onIncrease={increment}
        onDecrease={decrement}
        inputStyle={{
          borderColor: 'lightgrey',
          borderRadius: 55,
          borderWidth: 0.5,
        }}
        buttonLeftImage={
          <Image
            style={{width: 45, height: 45}}
            source={require('../../images/minus.png')}
          />
        }
        buttonRightImage={
          <Image
            style={{width: 45, height: 45}}
            source={require('../../images/plus.png')}
          />
        }
      />
    </View>
  );
};

export default SingleMenuItem;
