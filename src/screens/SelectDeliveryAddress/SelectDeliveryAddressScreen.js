import React, {useEffect, useState} from 'react';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Styles from '../../styles/Styles';
import ImageCircleButton from '../../components/ImageCircleButton';
import SelectAddressSingleView from '../../components/SelectAddressSingleView';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});
const SelectDeliveryAddressScreen = ({navigation}) => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  const goToNewAdreessScreen = () => {
    navigation.navigate('AddNewAddressScreen', {
      title: 'Add New Address',
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = navigation.addListener('focus', () => {
      setFlatListItems([]);
      getData();
    });

    return () => {
      // Unsubscribe for the focus Listener
      unsubscribe;
    };
  }, [selectedAddress, navigation]);

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM table_user_address', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
        setIsLoading(false);
      });
    });
  };

  const deleteAddress = (inputAddressId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  table_user_address where user_address_id=?',
        [inputAddressId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => getData(),
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Please insert a valid User Id');
          }
        },
      );
    });
  };

  const selectAddressHandler = (
    fullname,
    address,
    location,
    pincode,
    phone,
    email,
    tag,
    id,
  ) => {
    setSelectedAddress(tag);
    console.log(tag);
    navigation.navigate('CheckOutScreen', {
      fullname: fullname,
      address: address,
      location: location,
      pincode: pincode,
      phone: phone,
      email: email,
      tag: tag,
      addressId: id,
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          backgroundColor: '#ffffff',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onTouchStart={goToNewAdreessScreen}>
        <ImageCircleButton
          text=""
          size={35}
          color="#ffffff"
          textColor="white"
          fontSize={20}
          margin={10}
        />
        <Text style={Styles.customFontMedium}>Add a new address</Text>
      </View>
      <FlatList
        data={flatListItems}
        refreshing={isLoading}
        onRefresh={getData}
        renderItem={({item}) => (
          <SelectAddressSingleView
            navigation={navigation}
            id={item.user_address_id}
            fullname={item.user_fullname}
            address={item.user_address}
            location={item.user_location}
            pincode={item.user_pincode}
            phone={item.user_phone}
            email={item.user_email}
            tag={item.user_tag}
            selected={selectedAddress}
            onSelectedAddress={selectAddressHandler}
            onDeleteAddress={deleteAddress}
          />
        )}
        keyExtractor={(item, index) => item.user_address_id.toString()}
      />
    </SafeAreaView>
  );
};

export default SelectDeliveryAddressScreen;
