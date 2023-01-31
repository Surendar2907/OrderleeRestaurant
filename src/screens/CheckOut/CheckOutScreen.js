import React, {useState, useEffect} from 'react';
import {useGlobal} from 'reactn';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import CheckoutSingleItem from '../../components/CheckoutSingleItem';
import Styles from '../../styles/Styles';
import moment from 'moment';
import {openDatabase} from 'react-native-sqlite-storage';

import GlobalOrderModel from '../../models/OrderModel.js';
import {makeRequest} from '../../apis/Api';
import CustomProgressBar from '../Custom/CustomProgressBar';
import ShowToast from '../../components/ShowToast';
import {
  convertTime12to24,
  filterArrayWithCurrentTime,
  formatAMPM,
} from '../../components/SharedFunction';
import {time_entry} from '../../constants/Constants';

const {width} = Dimensions.get('window');
const CheckOutScreen = ({navigation, route}) => {
  const {
    addressId,
    fullname,
    address,
    location,
    pincode,
    phone,
    email,
    tag,
  } = route.params;
  var db = openDatabase({name: 'UserDatabase.db'});
  let controller;
  const [time, setTime] = useState('Deliver Now');
  const [items, setItems] = useState(getTimeItems());

  var tempPrice = 0;
  const [list, setList] = useGlobal('list');
  const [data, setData] = useGlobal('Data');
  const [totalPrice, setTotalPrice] = useState('totalPrice');
  const [proData, setProData] = useState([]);
  const [loading, setLoading] = useState(false);

  // This is to manage Modal State
  const [isModalVisible, setModalVisible] = useState(false);

  // This is to manage TextInput State
  const [inputValue, setInputValue] = useState('');

  // Create toggleModalVisibility function that will
  // Open and close modal upon button clicks.
  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
  };
  // const [finalList, setFinalList] = useState([])
  useEffect(() => {
    let identicalElements = [];
    data.forEach((element1) => {
      list.forEach((element2) => {
        if (element1['id'] === element2['id']) {
          element1['count'] = element2['count'];
          if (element1['count'] !== 0) {
            identicalElements.push(element1);
            tempPrice = tempPrice + element1['price'] * element1['count'];
          }
        }
      });
    });
    setProData(identicalElements);
    setTotalPrice(tempPrice.toFixed(2));
  }, [list]);

  function getTimeItems() {
    var times = filterArrayWithCurrentTime(time_entry);
    let newArray = [];
    for (let index = 0; index < times.length; index++) {
      const element = times[index];
      newArray[index] = {label: element.toString(), value: element.toString()};
    }
    return newArray;
  }

  // console.log(identicalElements);
  // console.log(tempPrice.toFixed(2))

  const goBackToSelectDeliveryScreen = () => {
    navigation.goBack();
  };

  const goSummaryScreen = (ordernumber, orderDate, orderNumberApi) => {
    if (totalPrice > 0) {
      navigation.navigate('OrderSummaryScreen', {
        addressId: addressId,
        orderId: ordernumber,
        orderDate: orderDate,
        orderNumberApi: orderNumberApi,
      });
    } else {
      ToastAndroid.show(
        "You don't have any item. Please go back and select something.",
        ToastAndroid.SHORT,
      );
    }
  };

  function generateOrderNumber() {
    var number = Math.floor(Math.random() * 1000000);
    return number;
  }

  function generateOrderDate() {
    var date = moment().utcOffset('+05:30').format('DD MMM,YYYY hh:mm:ss a');
    return date;
  }

  const addOrder = () => {
    var ordernumber = generateOrderNumber();
    var orderdate = generateOrderDate();
    if (ordernumber !== null) {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_orders (order_id, order_addressTag, order_totalPrice, order_address_id, order_timestamp) VALUES (?,?,?,?,?)',
          [ordernumber, tag, totalPrice, addressId, orderdate],
          (tx, results) => {
            // console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              // console.log('done: orders')
            } else alert('Add order failed');
          },
        );
      });

      db.transaction(function (tx) {
        for (let i = 0; i < proData.length; ++i) {
          tx.executeSql(
            'INSERT INTO table_order_products (orderid, productid, quantity) VALUES (?,?,?)',
            [ordernumber, proData[i].id, proData[i].count],
            (tx, results) => {
              // console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                // console.log('done:' + i)
              } else alert('Add order failed');
            },
          );
        }
      });

      placeOrder(ordernumber, orderdate);
    }
  };

  const createOrder = async () => {
    GlobalOrderModel.id = 0;
    GlobalOrderModel.customer_id = 0;
    GlobalOrderModel.order_number = 0;
    const billingAddress = {
      address_1: address,
      address_2: location,
      city: 'Mumbai',
      country: 'IN',
      email: email,
      first_name: fullname,
      last_name: '',
      phone: phone,
      postcode: pincode,
      state: 'Maharashtra',
    };
    GlobalOrderModel.setBillingAddress(billingAddress);

    const shippingAddress = {
      address_1: address,
      address_2: location,
      city: 'Mumbai',
      country: 'IN',
      first_name: fullname,
      last_name: '',
      postcode: pincode,
      state: 'Maharashtra',
    };

    GlobalOrderModel.setShippingAddress(shippingAddress);

    const lineItems = [];
    for (let i = 0; i < proData.length; ++i) {
      const lineItemsObject = {
        product_id: proData[i].id,
        quantity: proData[i].count,
        total: proData[i].price * proData[i].count,
      };
      lineItems.push(lineItemsObject);
    }
    GlobalOrderModel.setLineItems(lineItems);

    const orderMetadata = {
      address_tag: tag,
      delivery_time: time,
      device: Platform.OS,
      note: inputValue,
      msg_id: 'APA91bGw3nNIcdjUjU1LStjfnLU2ONLOj0aIQdgQjBc79X',
    };

    GlobalOrderModel.setOrderMetadata(orderMetadata);

    const paymentDetails = {
      method_id: 'cod',
      method_title: 'Cash on Delivery',
      paid: false,
    };

    GlobalOrderModel.setPaymentDetails(paymentDetails);

    console.log(JSON.stringify(GlobalOrderModel.getOrder()));
  };

  function placeOrder(ordernumber, orderdate) {
    createOrder();
    setLoading(true);
    console.log(makeRequest('orders', 'POST'));
    fetch(makeRequest('orders', 'POST'), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(GlobalOrderModel.getOrder()),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          var myJSON = JSON.stringify(responseJson);
          var obj = JSON.parse(myJSON);
          var orderNumberApi = obj.order.order_number;
          setLoading(false);
          goSummaryScreen(ordernumber, orderdate, orderNumberApi);
          console.log(obj.order.order_number);
        } else {
          ShowToast('Something went wrong! try again later...');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        ShowToast('Something went wrong.');
      });
  }

  const footer = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 400,
          justifyContent: 'space-between',
        }}>
        <View style={{marginLeft: 12, marginTop: 16}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 8,
              marginRight: 8,
            }}>
            <Text style={Styles.customFontMedium}>You Pay: </Text>
            <Text style={(Styles.customFontMedium, {color: 'green'})}>
              EGP {totalPrice}
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
          <Text style={[Styles.customFontNormal]}>
            Deliver To ({tag.toUpperCase()})
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              marginRight: 8,
            }}>
            <Text style={Styles.customFontNormal}>{fullname} </Text>
            <TouchableOpacity onPress={goBackToSelectDeliveryScreen}>
              <Text style={[Styles.customFontNormal, {color: 'grey'}]}>
                Change Address
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[Styles.customFontNormal, {marginTop: 12}]}>
            {address}
            {'\n'}
            {location}
            {'\n'}Pincode: {pincode}
            {'\n'}
            {phone}
            {'\n'}
            {email}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
      {loading ? (
        <CustomProgressBar placeholder="Placing new order..." />
      ) : (
        <View />
      )}
      <View style={{flex: 1, padding: 12}}>
        <View
          style={{
            marginBottom: 8,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={Styles.customFontSmall}>Your Delivery Time:</Text>
          <View style={{margin: 4, flex: 1}}>
            <DropDownPicker
              items={items}
              controller={(instance) => (controller = instance)}
              onChangeList={(items, callback) => {
                new Promise((resolve, reject) => resolve(setItems(items)))
                  .then(() => callback())
                  .catch(() => {});
              }}
              defaultValue={time}
              containerStyle={{height: 40, width: '100%'}}
              style={{backgroundColor: '#fafafa'}}
              itemStyle={{
                justifyContent: 'flex-start',

                height: 30,
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              labelStyle={Styles.customFontVerySmall}
              customArrowUp={(size, color) => (
                <Image
                  source={require('../../../images/ic_arrow_down.png')}
                  style={{
                    width: size,
                    height: size,
                    transform: [{rotate: '180deg'}],
                  }}
                />
              )}
              customArrowDown={(size, color) => (
                <Image
                  source={require('../../../images/ic_arrow_down.png')}
                  style={{
                    width: size,
                    height: size,
                  }}
                />
              )}
              defaultValue={time}
              onChangeItem={(item) => setTime(item.value)}
            />
          </View>
          <Image
            source={require('../../../images/time.png')}
            style={{
              width: 34,
              height: 34,
              marginLeft: 4,
              resizeMode: 'contain',
            }}
          />
          <TouchableOpacity onPress={toggleModalVisibility}>
            <Image
              source={require('../../../images/note.png')}
              style={{
                width: 34,
                height: 34,
                marginLeft: 4,
                marginRight: 8,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent
            visible={isModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={toggleModalVisibility}>
            <TouchableWithoutFeedback onPress={toggleModalVisibility}>
              <View style={[styles.viewWrapper]}>
                <View style={styles.triangle} />
                <View style={styles.modalView}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      margin: 5,
                    }}>
                    <Image
                      source={require('../../../images/note.png')}
                      style={{
                        width: 24,
                        height: 24,
                        resizeMode: 'contain',
                      }}
                    />
                    <Text style={[Styles.customFontMedium]}>Order Note</Text>
                    <Image
                      source={require('../../../images/ic_right_tick_mark.png')}
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  <TextInput
                    placeholder="Extra sauce on the side etc."
                    value={inputValue}
                    style={styles.textInput}
                    multiline={true}
                    onChangeText={(value) => setInputValue(value)}
                  />

                  <TextInput
                    placeholder="Extra sauce on the side etc."
                    value={inputValue}
                    style={[styles.textInput, {marginBottom: 8}]}
                    multiline={true}
                    onChangeText={(value) => setInputValue(value)}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <FlatList
          data={proData}
          renderItem={({item}) => (
            <CheckoutSingleItem
              id={item.id}
              title={item.title}
              price={item.price}
              count={item.count}
              isVeg={item.isVeg}
            />
          )}
          keyExtractor={(item, index) => item.id.toString()}
          ListFooterComponent={footer}
        />
      </View>

      <TouchableOpacity onPress={addOrder} style={Styles.appButtonContainer}>
        <Text style={[Styles.customFontMedium, Styles.appButtonText]}>
          Checkout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    justifyContent: 'center',
    top: '25%',
    left: '40%',
    elevation: 5,
    transform: [{translateX: -(width * 0.4)}, {translateY: -90}],
    width: (width + 30) * 0.8,
    padding: 8,
    backgroundColor: '#fff',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 4,
  },
  textInput: {
    width: '100%',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 16,
    borderBottomColor: 'lightblue',
    borderBottomWidth: 2,
  },
  triangle: {
    top: '14%',
    left: '38%',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 25,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
  },
});
export default CheckOutScreen;
