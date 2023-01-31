import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, Image, ActivityIndicator} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {setGlobal} from 'reactn';
import {makeRequest} from '../../apis/Api.js';
import {isVeg, removeTags} from '../../components/SharedFunction.js';
import ShowToast from '../../components/ShowToast.js';
import GlobalAppDashboardModel from '../../models/AppDashboardModel.js';
import Styles from '../../styles/Styles.js';
import EmptyDataScreen from '../EmptyData/EmptyDataScreen.js';
import NetInfo from '@react-native-community/netinfo';

const SpecialsScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe;
    };
  }, []);

  useEffect(() => {
    if (data.length === 0) {
      getAppdashboardData();
      getProducts();
      getCoupons();
    }
  }, [isConnected]);

  const getAppdashboardData = async () => {
    // console.log(makeRequest('appdashboard', 'GET'));
    await fetch(makeRequest('appdashboard', 'GET'), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var myJSON = JSON.stringify(responseJson);
        var obj = JSON.parse(myJSON);
        GlobalAppDashboardModel.setLocations(obj.locations);
        GlobalAppDashboardModel.setAbout(obj.about);
        GlobalAppDashboardModel.setTnc(obj.tnc);
      })
      .catch((error) => {
        // console.error(error);
        ShowToast('Something went wrong.');
      });
  };

  const getProducts = async () => {
    // console.log(makeRequest('products', 'GET'));
    fetch(makeRequest('products', 'GET'), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var myJSON = JSON.stringify(responseJson);
        var obj = JSON.parse(myJSON);
        var data = [];
        if (obj.hasOwnProperty('errors')) {
          console.log('Product error!');
        } else {
          for (let index = 0; index < obj.products.length; index++) {
            const element = obj.products[index].categories;
            data.push({
              id: parseInt(obj.products[index].id),
              title: obj.products[index].title.toString(),
              description: removeTags(
                obj.products[index].description.toString(),
              ),
              image_src: obj.products[index].featured_src,
              price: parseFloat(obj.products[index].price),
              count: 0,
              categories: obj.products[index].categories,
              isFavourite: false,
              isVeg: isVeg(obj.products[index].attributes),
            });
          }
        }
        setGlobal({
          Data: data,
        });
      })
      .catch((error) => {
        // console.error(error);
        ShowToast('Something went wrong.');
      });
  };

  const getCoupons = async () => {
    // console.log(makeRequest('coupons', 'GET'));
    await fetch(makeRequest('coupons', 'GET'), {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var myJSON = JSON.stringify(responseJson);
        var obj = JSON.parse(myJSON);
        // console.log(obj);
        setData(obj.coupons);
        setLoading(false);
      })
      .catch((error) => {
        // console.error(error);
        ShowToast('Something went wrong.');
        setLoading(false);
      });
  };

  const RenderSingleItem = ({image_src}) => (
    <View>
      <Image
        source={{uri: image_src}}
        style={{
          flex: 1,
          resizeMode: 'stretch',
          width: '100%',
          height: 600,
        }}
      />
    </View>
  );

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
        <FlatList
          data={data}
          renderItem={({item}) =>
            item.featured_src ? (
              <RenderSingleItem id={item.id} image_src={item.featured_src} />
            ) : null
          }
          keyExtractor={(item, index) => item.id.toString()}
          contentContainerStyle={data.length === 0 && Styles.centerEmptySet}
          ListEmptyComponent={
            <EmptyDataScreen
              title={'Empty'}
              description={'No Special Dishes available...'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SpecialsScreen;
