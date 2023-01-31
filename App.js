import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';

import {openDatabase} from 'react-native-sqlite-storage';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Styles from './src/styles/Styles';

import TermsAndConditionScreen from './src/screens/TermsAndConditionScreen/TermsAndConditionScreen';
import CartScreen from './src/screens/CartScreen/CartScreen';

import SpecialsScreen from './src/screens/TopTabBarScreens/SpecialsScreen';
import DailyMenuScreen from './src/screens/TopTabBarScreens/DailyMenuScreen';
import SoupScreen from './src/screens/TopTabBarScreens/SoupScreen';
import PastaScreen from './src/screens/TopTabBarScreens/PastaScreen';
import DrinksAndDessertsScreen from './src/screens/TopTabBarScreens/DrinksAndDessertsScreen';
import FavouriteScreen from './src/screens/TopTabBarScreens/FavouriteScreen';

import CustomSidebarMenu from './src/screens/Custom/CustomSidebarMenu';
import AboutUsSCreen from './src/screens/AboutUsScreen/AboutUsScreen';
import LeftHeaderComponent from './src/components/LeftHeaderComponent';
import {setGlobal} from 'reactn';
import SelectDeliveryAddressScreen from './src/screens/SelectDeliveryAddress/SelectDeliveryAddressScreen';
import AddNewAddressScreen from './src/screens/AddNewAddress/AddNewAddressScreen';
import CheckOutScreen from './src/screens/CheckOut/CheckOutScreen';
import OrderSummaryScreen from './src/screens/OrderSummary/OrderSummaryScreen';
import OrdersScreen from './src/screens/Orders/OrdersScreen';
import OurServiceAreaScreen from './src/screens/OurServiceArea/OurServiceAreaScreen';
import OfflineNotice from './src/screens/Custom/OfflineNotice';

setGlobal({
  count: 0,
  list: [],
  Data: [],
  setVeg: false,
});

// function reducer(state, action) {
//   switch (action.type) {
//     case 'reset':
//       return { count: 0 };
//     case 'increment':
//       return { count: state.count + 1 };
//     case 'decrement':
//       return { count: state.count - 1 };
//   }
// }

var db = openDatabase({name: 'UserDatabase.db'});

function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();
  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user_address'",
        [],
        function (tx, res) {
          // console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user_address', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user_address(user_address_id INTEGER PRIMARY KEY AUTOINCREMENT, user_fullname VARCHAR(50),' +
                'user_address VARCHAR(255), user_location VARCHAR(100), user_pincode INT(10), user_phone INT(10),' +
                'user_email VARCHAR(100), user_tag VARCHAR(50), selected INTEGER DEFAULT 0)',
              [],
            );
          }
        },
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_orders'",
        [],
        function (tx, res) {
          // console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_orders', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_orders(order_id INTEGER PRIMARY KEY, order_addressTag VARCHAR(50),' +
                'order_totalPrice INT(100), order_address_id INT(100), order_timestamp VARCHAR(200))',
              [],
            );
          }
        },
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_order_products'",
        [],
        function (tx, res) {
          // console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_order_products', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_order_products(orderid INT NOT NULL,productid INT NOT NULL,' +
                'quantity INT NOT NULL,PRIMARY KEY (orderid, productid),FOREIGN KEY (orderid) REFERENCES table_orders (order_id))',
              [],
            );
          }
        },
      );
    });
  }, []);

  const NavigationDrawerStructure = (props) => {
    //Structure for the navigatin Drawer
    const toggleDrawer = () => {
      //Props to open/close the drawer
      props.navigationProps.toggleDrawer();
    };

    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => toggleDrawer()}>
          {/*Donute Button Image */}
          <Image
            source={require('./images/ic_circle_menu.png')}
            style={{width: 30, height: 30, marginLeft: 12}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const getHeaderTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
    switch (routeName) {
      case 'OrderSummaryScreen':
        return 'Home';
      // case 'ExploreScreen':
      //   return 'Explore';
      case "WHAT'S COOKING":
        return 'Home';
    }
  };

  const TabStack = () => {
    return (
      <Tab.Navigator
        initialRouteName="SpecialsScreen"
        tabBarOptions={{
          activeTintColor: '#000000',
          inactiveTintColor: '#D3D3D3',
          scrollEnabled: true,
          tabStyle: {
            width: 'auto',
            padding: 0,
            marginLeft: 5,
            marginRight: 5,
          },
          style: {
            backgroundColor: '#FFFFFF',
          },
          labelStyle: {
            textAlign: 'center',
          },
          indicatorStyle: {
            borderBottomColor: '#000000',
            borderBottomWidth: 2,
          },
        }}>
        <Tab.Screen
          name="SpecialsScreen"
          component={SpecialsScreen}
          options={{
            tabBarLabel: 'Specials',
            /*tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="home"
              color={color}
              size={size}
              />
            ),*/
          }}
        />
        <Tab.Screen
          name="DailyMenuScreen"
          component={DailyMenuScreen}
          options={{
            tabBarLabel: 'Daily Menu',
            /*tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="settings"
              color={color}
              size={size}
              />
            ),*/
          }}
        />
        <Tab.Screen
          name="SoupScreen"
          component={SoupScreen}
          options={{
            tabBarLabel: 'Soup',
            /*tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="settings"
              color={color}
              size={size}
              />
            ),*/
          }}
        />
        <Tab.Screen
          name="PastaScreen"
          component={PastaScreen}
          options={{
            tabBarLabel: 'Pasta',
            /*tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="settings"
              color={color}
              size={size}
              />
            ),*/
          }}
        />
        <Tab.Screen
          name="DrinksAndDessertsScreen"
          component={DrinksAndDessertsScreen}
          options={{
            tabBarLabel: 'Drinks And Desserts',
            /*tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="settings"
              color={color}
              size={size}
              />
            ),*/
          }}
        />
        <Tab.Screen
          name="FavouriteScreen"
          component={FavouriteScreen}
          options={{
            tabBarLabel: 'Favourite',
            /*tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons
              name="settings"
              color={color}
              size={size}
              />
            ),*/
          }}
        />
      </Tab.Navigator>
    );
  };

  const HomeScreenStack = ({navigation}) => {
    return (
      <Stack.Navigator initialRouteName="SpecialsScreen">
        <Stack.Screen
          name="WHAT'S COOKING"
          component={TabStack}
          options={({route}) => ({
            headerTitle: getHeaderTitle(route),
            headerLeft: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
            headerRight: () => (
              <LeftHeaderComponent navigationProps={navigation} />
            ),
            headerStyle: {
              backgroundColor: '#FFFFFF', //Set Header color
            },
            headerTintColor: '#000000', //Set Header text color
            headerTitleStyle: Styles.customFontBig, //Set Header text style
            headerTitleContainerStyle: {left: 55, right: 0},
          })}
        />
        <Stack.Screen
          name="TermsAndConditionScreen"
          component={TermsAndConditionScreen}
          options={{
            title: 'Terms & Condition', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="AboutUsScreen"
          component={AboutUsSCreen}
          options={{
            title: 'About Us', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="OurServiceAreaScreen"
          component={OurServiceAreaScreen}
          options={{
            title: 'Our Service Area', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            title: 'Cart', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="SelectDeliveryAddressScreen"
          component={SelectDeliveryAddressScreen}
          options={{
            title: 'Select Delivery Address', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="AddNewAddressScreen"
          component={AddNewAddressScreen}
          options={{
            title: 'Add New Address', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="CheckOutScreen"
          component={CheckOutScreen}
          options={{
            title: 'CheckOut', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
        <Stack.Screen
          name="OrderSummaryScreen"
          component={OrderSummaryScreen}
          options={{
            title: 'Order Summary', //Set Header Title
            headerTitleStyle: Styles.customFontBig,
          }}
        />
      </Stack.Navigator>
    );
  };

  const OrdersScreenStack = ({navigation}) => {
    return (
      <Stack.Navigator
        initialRouteName="SecondPage"
        screenOptions={{
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF', //Set Header color
          },
          headerTintColor: '#000000', //Set Header text color
          headerTitleStyle: Styles.customFontBig,
          //Set Header text style
        }}>
        <Stack.Screen
          name="OrdersScreen"
          component={OrdersScreen}
          options={{
            title: 'Orders', //Set Header Title
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <OfflineNotice />
      <Drawer.Navigator
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
        drawerContentOptions={{
          activeTintColor: '#f4511e',
          itemStyle: {marginVertical: 5},
          labelStyle: Styles.customFontMedium,
        }}>
        <Drawer.Screen
          name="HomeScreenStack"
          options={{
            drawerLabel: 'Home',
            groupName: 'Section 1',
            activeTintColor: '#f4511e',
            drawerIcon: ({focused, color, size}) => (
              <Image
                // source={
                //   focused
                //     ? require('./asset/logo1.png')
                //     : require('./asset/logo4.png')
                // }
                source={require('./images/tag_address_icon.png')}
                style={{
                  width: size,
                  height: size,
                }}
              />
            ),
          }}
          component={HomeScreenStack}
        />
        <Drawer.Screen
          name="OrdersScreenStack"
          options={{
            drawerLabel: 'Orders',
            groupName: 'Section 1',
            activeTintColor: '#f4511e',
            drawerIcon: ({focused, color, size}) => (
              <Image
                source={require('./images/orders_dark.png')}
                style={{
                  width: size,
                  height: size,
                }}
              />
            ),
          }}
          component={OrdersScreenStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
