import React, {useRef, useState, useEffect} from 'react';
import {View, SafeAreaView, ActivityIndicator} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import OrderSingleItem from '../../components/OrdersSingleItem';
import {openDatabase} from 'react-native-sqlite-storage';
import EmptyDataScreen from '../EmptyData/EmptyDataScreen';
import Styles from '../../styles/Styles';
import {makeRequest} from '../../apis/Api';
import ShowToast from '../../components/ShowToast';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from '../../constants/Constants';

const OrdersScreen = ({navigation}) => {
  var db = openDatabase({name: 'UserDatabase.db'});
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      // getData();
      readDataCustomerId();
    });

    return () => {
      // Unsubscribe for the focus Listener
      unsubscribe;
    };
  }, [navigation]);

  const readDataCustomerId = async () => {
    var customerId = null;
    try {
      customerId = await AsyncStorage.getItem(
        Constants.STORAGE_KEY_FOR_CUSTOMER_ID,
      );
      getOrders(customerId);
    } catch (e) {
      // alert('Failed to fetch the data from storage');
      console.log(e);
    }
    return customerId;
  };

  const getOrders = (customerId) => {
    // console.log('id:' + customerId);
    if (customerId !== null) {
      // console.log(makeRequest('customers/' + customerId + '/orders', 'GET'));
      fetch(makeRequest('customers/' + customerId + '/orders', 'GET'), {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {
          var myJSON = JSON.stringify(responseJson);
          var obj = JSON.parse(myJSON);
          // console.log(myJSON);
          // setData(obj.coupons);
          if (obj.hasOwnProperty('errors')) {
            setOrderData([]);
          } else {
            setOrderData(obj.orders);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          ShowToast('Something went wrong.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM table_orders', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setOrderData(temp);
        // console.log(temp)
      });
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <ActivityIndicator
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          animating={true}
          size="large"
          color="#f4511e"
        />
      ) : (
        <View>
          <FlatList
            data={orderData}
            renderItem={({item}) => (
              <OrderSingleItem
                id={item.id} // id={item.order_id}
                time={item.completed_at} // time={item.order_timestamp}
                price={item.subtotal} // price={item.order_totalPrice}
                tag={item.shipping_address.address_tag} // tag={item.order_addressTag}
                addressId={item.order_address_id} // addressId={item.order_address_id}
                status={item.status} // status={'current'}
                currency={item.currency}
                navigation={navigation}
              />
            )}
            initialNumToRender={10}
            keyExtractor={(item, index) => item.id.toString()} //item.order_id.toString()
            contentContainerStyle={
              orderData.length === 0 && Styles.centerEmptySet
            }
            ListEmptyComponent={
              <EmptyDataScreen
                title={'Empty'}
                description={'Opps, No Previous Orders...'}
              />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;
