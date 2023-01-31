import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useGlobal, setGlobal} from 'reactn';
import OrderSummarySingleItem from '../../components/OrderSummarySingleItem';
import {BackHandler} from 'react-native';
import Styles from '../../styles/Styles';
import {openDatabase} from 'react-native-sqlite-storage';
import {checkTag} from '../../components/SharedFunction';
import {makeRequest} from '../../apis/Api';
import moment from 'moment';
import ShowToast from '../../components/ShowToast';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from '../../constants/Constants';

const OrderSummaryScreen = ({navigation, route}) => {
  const {orderId, addressId, orderDate, from, orderNumberApi} = route.params;
  var db = openDatabase({name: 'UserDatabase.db'});
  const [addressData, setAddressData] = useState([
    {
      user_fullname: '',
      user_address: '',
      user_location: '',
      user_pincode: '',
      user_phone: '',
      user_email: '',
      user_tag: '',
    },
  ]);
  const [productData, setProductData] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [orderDateTime, setOrderDateTime] = useState(orderDate);
  const [orderNumber, setOrderNumber] = useState(orderId);
  const [discount, setDiscount] = useState(0.0);
  const [taxes, setTaxes] = useState(0.0);
  const [deliveryCharge, setDeliveryCharge] = useState(0.0);
  const [currency, setCurrency] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [orderStatus, setOrderStatus] = useState();
  const [data, setData] = useGlobal('Data');
  const [list, setList] = useGlobal('list');
  const [count, setCount] = useGlobal('count');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            handleBackButtonClick();
          }}>
          <Image
            source={require('../../../images/ic_home_address.png')}
            style={{width: 30, height: 30, marginLeft: 12}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    // getData();
    //getAddressData();
  }, []);

  useEffect(() => {
    // console.log(GlobalOrderModel);
    console.log(makeRequest('orders/' + orderNumberApi, 'GET'));
    fetch(makeRequest('orders/' + orderNumberApi, 'GET'), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var myJSON = JSON.stringify(responseJson);
        var obj = JSON.parse(myJSON);
        // console.log(obj);
        const order = obj.order;
        // setData(obj.coupons);
        // setLoading(false);
        setAddressData([
          {
            user_fullname: order.billing_address.first_name,
            user_address: order.billing_address.address_1,
            user_location: order.billing_address.address_2,
            user_pincode: order.billing_address.postcode,
            user_phone: order.billing_address.phone,
            user_email: order.billing_address.email,
            user_tag: order.billing_address.address_tag,
          },
        ]);
        setOrderDateTime(
          moment
            .utc(order.completed_at)
            .utcOffset('+05:30')
            .format('DD MMM,YYYY hh:mm:ss a'),
        );
        setOrderNumber(order.order_number);
        setTotalPrice(order.total);
        setProductData(order.line_items);
        setDiscount(order.total_discount);
        setTaxes(order.total_tax);
        setDeliveryCharge(order.shipping_tax);
        setCurrency(order.currency);
        setPaymentMethod(order.payment_details.method_title);
        if (order.status === 'pending') {
          setOrderStatus('current');
        } else {
          setOrderStatus(order.status);
        }
        saveDataCustomerId(order.customer_id);
      })
      .catch((error) => {
        console.error(error);
        ShowToast('Something went wrong.');
        // setLoading(false);
      });
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  function handleBackButtonClick() {
    if (from === 'Orders') {
      navigation.goBack();
      navigation.navigate('OrdersScreen');
    } else {
      setCount(0);
      setList([]);
      navigation.popToTop();
    }
    return true;
  }

  const saveDataCustomerId = async (customerId) => {
    try {
      await AsyncStorage.setItem(
        Constants.STORAGE_KEY_FOR_CUSTOMER_ID,
        customerId.toString(),
      );
      // alert('Data successfully saved');
    } catch (e) {
      // alert('Failed to save the data to the storage');
    }
  };

  const calculatePrice = (orderData) => {
    var tempPrice = 0;
    var temp = [];

    orderData.forEach((element1) => {
      data.forEach((element2) => {
        if (element1['productid'] === element2['id']) {
          if (element1['count'] !== 0) {
            element2['count'] = element1['quantity'];
            temp.push(element2);
            tempPrice = tempPrice + element2['price'] * element1['quantity'];
          }
        }
      });
    });
    setProductData(temp);
    // console.log(temp)
    // console.log(tempPrice.toFixed(2))
    setTotalPrice(tempPrice.toFixed(2));
  };

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_order_products where orderid = ?',
        [orderId],
        (tx, results) => {
          var temp = [];

          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            // console.log(temp)
            calculatePrice(temp);
          } else {
            alert('No order found');
          }
        },
      );
    });
  };

  const getAddressData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_user_address where user_address_id = ?',
        [addressId],
        (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setAddressData(temp);
            // console.log(temp)
          } else {
            alert('No Address found');
          }
        },
      );
    });
  };

  const header = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            padding: 16,
            backgroundColor: 'lightgrey',
          }}>
          <Text style={Styles.customFontNormal}>Orders Detail</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            padding: 16,
            backgroundColor: 'white',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={Styles.customFontNormal}>{orderDateTime}</Text>
            <Text style={Styles.customFontNormal}>
              {currency} {TotalPrice}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {checkTag(addressData[0].user_tag)}
              <Text style={[Styles.customFontNormal, {marginLeft: 8}]}>
                {addressData[0].user_tag.toUpperCase()}
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
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            marginLeft: 16,
            marginTop: 16,
            marginRight: 16,
            paddingBottom: 16,
            borderBottomColor: 'grey',
            borderBottomWidth: 0.2,
          }}>
          <Text style={Styles.customFontNormal}>Order Number</Text>
          <Text style={[Styles.customFontNormal, {color: 'green'}]}>
            {orderNumber}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            marginLeft: 16,
            marginTop: 16,
            marginRight: 16,
            paddingBottom: 16,
            borderBottomColor: 'grey',
            borderBottomWidth: 0.2,
          }}>
          <Text style={Styles.customFontNormal}>Payment</Text>
          <Text style={[Styles.customFontNormal, {color: 'grey'}]}>
            {paymentMethod}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            marginLeft: 16,
            marginTop: 16,
            marginRight: 16,
            paddingBottom: 16,
          }}>
          <Text style={Styles.customFontNormal}>Delivery To</Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
            {checkTag(addressData[0].user_tag)}
            <Text style={[Styles.customFontNormal, {marginLeft: 8}]}>
              {addressData[0].user_tag.toUpperCase()}
            </Text>
          </View>
          <Text style={[Styles.customFontNormal, {marginTop: 8}]}>
            {addressData[0].user_address}
            {'\n'}
            {addressData[0].user_location}
            {'\n'}
            Pincode: {addressData[0].user_pincode}
            {'\n'}
            {addressData[0].user_phone}
            {'\n'}
            {addressData[0].user_email}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            padding: 16,
            backgroundColor: 'lightgrey',
          }}>
          <Text style={Styles.customFontNormal}>Orders Summary</Text>
        </View>
      </View>
    );
  };

  const footer = () => {
    return (
      <View
        style={{
          marginTop: 18,
          marginLeft: 16,
          marginRight: 16,
          marginBottom: 18,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={Styles.customFontNormalBold}>Total Price</Text>
          <Text style={Styles.customFontNormalBold}>
            {currency} {TotalPrice}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={Styles.customFontNormal}>Discount</Text>
          <Text style={Styles.customFontNormal}>
            {currency} {discount}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={Styles.customFontNormal}>Taxes</Text>
          <Text style={Styles.customFontNormal}>
            {currency} {taxes}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={Styles.customFontNormal}>Delivery Charge</Text>
          <Text style={Styles.customFontNormal}>
            {currency} {deliveryCharge}
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: 'lightgrey',
            borderBottomWidth: 0.2,
            marginTop: 18,
            marginBottom: 18,
          }}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={Styles.customFontNormalBold}>You Pay</Text>
          <Text style={Styles.customFontNormalBold}>
            {currency} {TotalPrice}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={productData}
        renderItem={({item}) => (
          <OrderSummarySingleItem
            id={item.id}
            title={item.name}
            image_src={item.img_url}
            price={parseFloat(item.price).toFixed(2)}
            count={item.quantity}
            isVeg={item.isVeg}
          />
        )}
        keyExtractor={(item, index) => item.id.toString()}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
      />
    </SafeAreaView>
  );
};

export default OrderSummaryScreen;
