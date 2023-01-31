import React, {useState, useEffect} from 'react';
import {Animated, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card} from 'react-native-shadow-cards';
import Styles from '../styles/Styles';
import {checkTag} from '../components/SharedFunction';
import moment from 'moment';
import SCALE from './SCALE';

const OrderSingleItem = ({
  id,
  addressId,
  time,
  price,
  tag,
  status,
  navigation,
}) => {
  const [orderStatus, setOrderStatus] = useState(status);
  const scaleInAnimated = new Animated.Value(0);
  const scaleOutAnimated = new Animated.Value(0);
  useEffect(() => {
    if (status === 'pending') {
      setOrderStatus('current');
    } else {
      setOrderStatus(status);
    }
  }, []);

  const goToSummary = () => {
    navigation.navigate('OrderSummaryScreen', {
      addressId: addressId,
      orderId: id,
      orderNumberApi: id,
      orderDate: time,
      from: 'Orders',
    });
  };
  return (
    <TouchableOpacity
      onPress={goToSummary}
      onPressIn={() => {
        SCALE.pressInAnimation(scaleInAnimated);
      }}
      onPressOut={() => {
        SCALE.pressOutAnimation(scaleInAnimated);
      }}
      style={SCALE.getScaleTransformationStyle(scaleInAnimated)}>
      <Animated.View
        style={{
          marginTop: 4,
          marginLeft: 8,
          marginRight: 8,
          marginBottom: 4,
          alignItems: 'center',
        }}>
        <Card
          style={{elevation: 0, cornerRadius: 5, opacity: 1, width: '100%'}}>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              padding: 16,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={Styles.customFontNormal}>
                {moment
                  .utc(time)
                  .utcOffset('+05:30')
                  .format('DD MMM,YYYY hh:mm:ss a')}
              </Text>
              <Text style={Styles.customFontNormal}>EGP {price}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 16,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {checkTag(tag)}
                <Text style={[Styles.customFontNormal, {marginLeft: 8}]}>
                  {tag.toUpperCase()}
                </Text>
              </View>
              {orderStatus === 'current' ? (
                <Text style={[Styles.customFontNormal, {color: 'red'}]}>
                  {orderStatus}
                </Text>
              ) : (
                <Text style={[Styles.customFontNormal, {color: 'green'}]}>
                  {orderStatus}
                </Text>
              )}
            </View>
          </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default OrderSingleItem;
