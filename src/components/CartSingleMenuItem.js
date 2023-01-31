import React, {useEffect, useState} from 'react';
import {Button, View, Text, SafeAreaView, Image} from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import {Card} from 'react-native-shadow-cards';
import {useGlobal} from 'reactn';
import Styles from '../styles/Styles';
import {renderVegOrNonVegImage} from './SharedFunction';

const CartSingleMenuItem = ({
  id,
  title,
  price,
  description,
  image_src,
  isVeg,
}) => {
  const [value, setValue] = useState(0);
  const [count, setCount] = useGlobal('count');
  const [list, setList] = useGlobal('list');

  useEffect(() => {
    var id = checkCountValue();
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
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 2,
        alignItems: 'center',
      }}>
      <Card style={{elevation: 4, cornerRadius: 5, opacity: 1, width: '100%'}}>
        <View style={{flexDirection: 'row', margin: 6}}>
          <Image
            source={{uri: image_src}}
            style={{
              width: 90,
              height: '100%',
              resizeMode: 'cover',
            }}
          />
          <View style={{flex: 1, margin: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[Styles.customFontSmall, {flex: 4}]}>{title}</Text>
              <Text style={[Styles.customFontSmall, {flex: 2}]}>
                EGP {(price * value).toFixed(2)}
              </Text>
              {renderVegOrNonVegImage(isVeg)}
            </View>
            <InputSpinner
              style={{width: 150}}
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
                  style={{width: 35, height: 35}}
                  source={require('../../images/minus.png')}
                />
              }
              buttonRightImage={
                <Image
                  style={{width: 35, height: 35}}
                  source={require('../../images/plus.png')}
                />
              }
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default CartSingleMenuItem;
