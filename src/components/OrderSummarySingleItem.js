import React, {useState, useEffect} from 'react';
import {Button, View, Text, SafeAreaView, Image} from 'react-native';
import {Card} from 'react-native-paper';
import Styles from '../styles/Styles';
import {renderVegOrNonVegImage} from './SharedFunction';

const OrderSummarySingleItem = ({
  id,
  title,
  price,
  image_src,
  count,
  isVeg,
}) => {
  return (
    <View
      style={{
        marginLeft: 4,
        marginRight: 4,
        marginTop: 2,
        alignItems: 'center',
      }}>
      <Card style={{elevation: 0, cornerRadius: 5, opacity: 1, width: '100%'}}>
        <View style={{flexDirection: 'row', margin: 8}}>
          <Image
            source={{uri: image_src}}
            style={{
              width: 60,
              height: '100%',
              resizeMode: 'cover',
            }}
          />
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  Styles.customFontSmall,
                  {flex: 4, marginLeft: 8, marginTop: 8},
                ]}>
                {title}
              </Text>
              <Text
                style={[
                  Styles.customFontSmall,
                  {flex: 2, marginLeft: 8, marginTop: 8},
                ]}>
                EGP {(price * count).toFixed(2)}
              </Text>
              {renderVegOrNonVegImage(isVeg)}
            </View>
            <Text style={[Styles.customFontSmall, {margin: 6}]}>
              Qty {count}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default OrderSummarySingleItem;
