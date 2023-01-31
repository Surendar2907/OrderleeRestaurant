import React, {useState, useEffect} from 'react';
import {Button, View, Text, SafeAreaView, Image} from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import Styles from '../styles/Styles';
import {useGlobal} from 'reactn';
import {renderVegOrNonVegImage} from './SharedFunction';

const CheckoutSingleItem = ({id, title, price, isVeg}) => {
  const [value, setValue] = useState(0);
  const [count, setCount] = useGlobal('count');
  const [list, setList] = useGlobal('list');

  useEffect(() => {
    checkCountValue();
  }, [count]);

  function checkCountValue() {
    if (list.length > 0) {
      var index = list.findIndex((x) => x.id === id);
      if (index !== -1) {
        setValue(list[index].count);
      }
    }
  }

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
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingTop: 4,
        paddingBottom: 2,
        paddingRight: 4,
        paddingLeft: 4,
        backgroundColor: '#ffffff',
      }}>
      {renderVegOrNonVegImage(isVeg)}
      <Text style={[Styles.customFontVerySmall, {marginLeft: 8, flex: 3}]}>
        {title}
      </Text>
      <InputSpinner
        style={{width: 120}}
        max={10}
        min={0}
        step={1}
        color={'#00000000'}
        rounded={false}
        editable={false}
        fontSize={10}
        value={value}
        onChange={(num) => {
          updateFromKeyboard(num);
        }}
        onIncrease={increment}
        onDecrease={decrement}
        buttonLeftImage={
          <Image
            style={{width: 25, height: 25}}
            source={require('../../images/minus.png')}
          />
        }
        buttonRightImage={
          <Image
            style={{width: 25, height: 25}}
            source={require('../../images/plus.png')}
          />
        }
      />
      <Text style={[Styles.customFontVerySmall]}>
        EGP {(price * value).toFixed(2)}
      </Text>
    </View>
  );
};

export default CheckoutSingleItem;
