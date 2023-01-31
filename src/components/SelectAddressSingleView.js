import React, {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {View, Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useEffect} from 'reactn';
import Styles from '../styles/Styles';
import {checkTag} from '../components/SharedFunction';

const SelectAddressSingleView = ({
  navigation,
  id,
  fullname,
  address,
  location,
  pincode,
  phone,
  email,
  tag,
  selected,
  onSelectedAddress,
  onDeleteAddress,
}) => {
  const [checked, setChecked] = useState();
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    setChecked(selected === tag ? true : false);
  }, []);

  return (
    <View style={{flexDirection: 'column', margin: 8}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        {checkTag(tag)}
        <Text style={[Styles.customFontNormal, {marginLeft: 8}]}>
          {tagName}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            flex: 2,
          }}>
          <RadioButton
            value={tag}
            status={checked ? 'checked' : 'unchecked'}
            color={'#000000'}
            onPress={() =>
              onSelectedAddress(
                fullname,
                address,
                location,
                pincode,
                phone,
                email,
                tag,
                id,
              )
            }
          />
          <Text style={Styles.customFontNormal}>{fullname}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddNewAddressScreen', {
                title: 'Update Address',
                edit_id: id,
                edit_fullname: fullname,
                edit_address: address,
                edit_location: location,
                edit_pincode: pincode,
                edit_phone: phone,
                edit_email: email,
                edit_tag: tag,
                edit_selected: selected,
              })
            }>
            <Image
              source={require('../../images/ic_edit.png')}
              style={{
                width: 26,
                height: 26,
                marginLeft: 40,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={() => onDeleteAddress(id)}>
            <Image
              source={require('../../images/ic_delete.png')}
              style={{
                width: 26,
                height: 26,
                marginRight: 8,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[Styles.customFontNormal, {marginLeft: 38, marginTop: 8}]}>
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
  );
};

export default SelectAddressSingleView;
