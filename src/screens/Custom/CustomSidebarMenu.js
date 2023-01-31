// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React from 'react';
import {SafeAreaView, StyleSheet, Image, Linking} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Styles from '../../styles/Styles';
import SlideDownUpView from './SlideDownUpView.js';

const CustomSidebarMenu = (props) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      {/*Top Large Image */}
      <Image
        source={require('../../../images/orderlee_logo.png')}
        style={styles.sideMenuProfileIcon}
      />
      {/* <Image width={200} height={267} source={{uri: 'orderlee_logo'}} style={{width: 200, height: 267}} /> */}

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="About Us"
          labelStyle={Styles.customFontMedium}
          icon={({focused, color, size}) => (
            <Image
              source={require('../../../images/about_n.png')}
              // source={{uri: 'about_n'}}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
          onPress={() => props.navigation.navigate('AboutUsScreen')}
        />

        <SlideDownUpView />
        {/* <DrawerItem
          label="Contact Us"
          labelStyle={Styles.customFontMedium}
          icon={({focused, color, size}) => (
            <Image
              source={require('../../images/contact_n.png')}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
          onPress={() => Linking.openURL('https://ospasta.com/')}
        /> */}
        <DrawerItem
          label="Refer A Friend"
          labelStyle={Styles.customFontMedium}
          icon={({focused, color, size}) => (
            <Image
              source={require('../../../images/refer.png')}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
          onPress={() => Linking.openURL('https://ospasta.com/')}
        />
        <DrawerItem
          label="Our Service Area"
          labelStyle={Styles.customFontMedium}
          icon={({focused, color, size}) => (
            <Image
              source={require('../../../images/location_9.png')}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
          onPress={() => props.navigation.navigate('OurServiceAreaScreen')}
        />
        <DrawerItem
          label="Terms & Conditions"
          labelStyle={Styles.customFontMedium}
          icon={({focused, color, size}) => (
            <Image
              source={require('../../../images/terms_and_conditions.png')}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
          onPress={() => props.navigation.navigate('TermsAndConditionScreen')}
        />
        {/* <View style={styles.customItem}>
          <Text
            onPress={() => {
              Linking.openURL('https://aboutreact.com/');
            }}>
            Rate Us
          </Text>
          <Image
            source={{uri: BASE_PATH + 'star_filled.png'}}
            style={styles.iconStyle}
          />
        </View> */}
      </DrawerContentScrollView>
      {/* <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
        www.aboutreact.com
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomSidebarMenu;
