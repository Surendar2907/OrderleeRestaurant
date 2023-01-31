import React, {useState, useEffect} from 'react';
import {RadioButton} from 'react-native-paper';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Styles from '../../styles/Styles';
import DropDownPicker from 'react-native-dropdown-picker';
import {openDatabase} from 'react-native-sqlite-storage';
import {useGlobal} from 'reactn';
import GlobalAppDashboardModel from '../../models/AppDashboardModel';

var db = openDatabase({name: 'UserDatabase.db'});

const AddNewAddressScreen = ({navigation, route}) => {
  let controller;
  useEffect(() => {
    navigation.setOptions({title: route.params.title});
  }, []);
  const [fullName, setFullName] = useState(
    route.params.edit_fullname ? route.params.edit_fullname : '',
  );
  const [address, setAddress] = useState(
    route.params.edit_address ? route.params.edit_address : '',
  );
  const [location, setLocation] = useState(
    route.params.edit_location ? route.params.edit_location : '',
  );
  const [pincode, setPincode] = useState(
    route.params.edit_pincode ? route.params.edit_pincode + '' : '',
  );
  const [phone, setPhone] = useState(
    route.params.edit_phone ? route.params.edit_phone + '' : '',
  );
  const [email, setEmail] = useState(
    route.params.edit_email ? route.params.edit_email : '',
  );
  const [checked, setChecked] = useState(
    route.params.edit_tag ? route.params.edit_tag : '',
  );
  const [items, setItems] = useState(setLocationItems());

  function setLocationItems() {
    var locations = GlobalAppDashboardModel.getLocations();
    let newArray = [];
    for (let index = 0; index < locations.length; index++) {
      const element = locations[index];
      newArray[index] = {label: element.toString(), value: element.toString()};
    }
    return newArray;
  }

  let add_address = () => {
    console.log(fullName, address, location, pincode, phone, email);

    if (!fullName) {
      alert('Please fill name');
      return;
    }
    if (!address) {
      alert('Please fill Address');
      return;
    }
    if (!location) {
      alert('Please fill Location');
      return;
    }
    if (!pincode) {
      alert('Please fill Pincode');
      return;
    }
    if (!phone) {
      alert('Please fill Phone Number');
      return;
    }
    if (!email) {
      alert('Please fill Email');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user_address (user_fullname, user_address, user_location, user_pincode,' +
          'user_phone, user_email, user_tag, selected) VALUES (?,?,?,?,?,?,?,?)',
        [fullName, address, location, pincode, phone, email, checked, 0],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Address Added Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                },
              ],
              {cancelable: false},
            );
          } else alert('Registration Failed');
        },
      );
    });
  };

  let updateAddress = () => {
    if (!fullName) {
      alert('Please fill name');
      return;
    }
    if (!address) {
      alert('Please fill Address');
      return;
    }
    if (!location) {
      alert('Please fill Location');
      return;
    }
    if (!pincode) {
      alert('Please fill Pincode');
      return;
    }
    if (!phone) {
      alert('Please fill Phone Number');
      return;
    }
    if (!email) {
      alert('Please fill Email');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE table_user_address set user_fullname=?, user_address=?, user_location=?, user_pincode=?,' +
          'user_phone=?, user_email=?, user_tag=?, selected=? where user_address_id=?',
        [
          fullName,
          address,
          location,
          pincode,
          phone,
          email,
          checked,
          0,
          route.params.edit_id,
        ],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Address updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.goBack(),
                },
              ],
              {cancelable: false},
            );
          } else alert('Updation Failed');
        },
      );
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          justifyContent: 'space-between',
        }}>
        <View style={{paddingLeft: 12, paddingRight: 12}}>
          <TextInput
            style={[
              Styles.customFontMedium,
              {
                width: '100%',
                height: 40,
                borderColor: 'gray',
                borderBottomWidth: 1,
                margin: 4,
              },
            ]}
            placeholder="Full Name"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />
          <TextInput
            style={[
              Styles.customFontMedium,
              {
                width: '100%',
                height: 40,
                borderColor: 'gray',
                borderBottomWidth: 1,
                margin: 4,
              },
            ]}
            placeholder="Society/Building/Street Name"
            onChangeText={(text) => setAddress(text)}
            value={address}
            autoCompleteType={'street-address'}
          />
          <View style={{margin: 4}}>
            <DropDownPicker
              onOpen={Keyboard.dismiss}
              onClose={Keyboard.dismiss}
              items={items}
              controller={(instance) => (controller = instance)}
              onChangeList={(items, callback) => {
                new Promise((resolve, reject) => resolve(setItems(items)))
                  .then(() => callback())
                  .catch(() => {});
              }}
              searchable={true}
              defaultValue={location}
              containerStyle={{height: 40}}
              style={{backgroundColor: '#fafafa', padding: 4}}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{backgroundColor: '#fafafa'}}
              dropDownMaxHeight={300}
              labelStyle={{
                fontFamily: 'Gotham-Book',
                fontSize: 16,
              }}
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
              defaultValue={location}
              onChangeItem={(item) => setLocation(item.value)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={[
                Styles.customFontMedium,
                {
                  flex: 1,
                  width: '100%',
                  height: 40,
                  borderColor: 'gray',
                  borderBottomWidth: 1,
                  margin: 4,
                },
              ]}
              placeholder="Postcode/Zip"
              onChangeText={(text) => setPincode(text)}
              value={pincode}
              autoCompleteType={'postal-code'}
              keyboardType={'number-pad'}
              maxLength={6}
            />
            <TextInput
              style={[
                Styles.customFontMedium,
                {
                  flex: 1,
                  width: '100%',
                  height: 40,
                  borderColor: 'gray',
                  borderBottomWidth: 1,
                  margin: 4,
                },
              ]}
              placeholder="Phone"
              onChangeText={(text) => setPhone(text)}
              value={phone}
              autoCompleteType={'tel'}
              keyboardType={'phone-pad'}
              maxLength={10}
            />
          </View>
          <TextInput
            style={[
              Styles.customFontMedium,
              {
                width: '100%',
                height: 40,
                borderColor: 'gray',
                borderBottomWidth: 1,
                margin: 4,
              },
            ]}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCompleteType={'email'}
            keyboardType={'email-address'}
          />
          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 30,
              }}>
              <Image
                source={require('../../../images/tag_address_icon.png')}
                style={{
                  width: 26,
                  height: 26,
                }}
              />
              <Text style={Styles.customFontMedium}>Tag Address</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
                marginTop: 10,
              }}>
              <RadioButton
                value="Home"
                status={checked === 'Home' ? 'checked' : 'unchecked'}
                color={'#000000'}
                onPress={() => setChecked('Home')}
              />
              <Text style={Styles.customFontMedium}>Home</Text>
              <RadioButton
                value="Work"
                status={checked === 'Work' ? 'checked' : 'unchecked'}
                color={'#000000'}
                onPress={() => setChecked('Work')}
              />
              <Text style={Styles.customFontMedium}>Work</Text>
              <RadioButton
                value="Other"
                status={checked === 'Other' ? 'checked' : 'unchecked'}
                color={'#000000'}
                onPress={() => setChecked('Other')}
              />
              <Text style={Styles.customFontMedium}>Other</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={Styles.appButtonContainer}
          onPress={
            route.params.title === 'Add New Address'
              ? add_address
              : updateAddress
          }>
          <Text style={[Styles.customFontMedium, Styles.appButtonText]}>
            {route.params.title === 'Add New Address'
              ? 'Add Address'
              : 'Update Address'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddNewAddressScreen;
