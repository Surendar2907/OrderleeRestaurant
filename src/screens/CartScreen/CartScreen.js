import React, {useState} from 'react';
import {useEffect} from 'react';
import {View, Text, SafeAreaView, ToastAndroid} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {useGlobal} from 'reactn';
import CartSingleMenuItem from '../../components/CartSingleMenuItem';
import SuggestionDailog from '../../components/SuggestionDailog';
import SuggestionSingleItem from '../../components/SuggestionSingleItem';
import Styles from '../../styles/Styles';
import EmptyDataScreen from '../EmptyData/EmptyDataScreen';

const CartScreen = ({navigation}) => {
  const [list, setList] = useGlobal('list');
  const [data, setData] = useGlobal('Data');
  const [totalPrice, setTotalPrice] = useState('totalPrice');
  const [proData, setProData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [item, setItem] = useState({
    id: 0,
    title: '',
    price: 0.0,
    description: '',
    image_src: '',
    isFavourite: false,
  });
  // const [finalList, setFinalList] = useState([])
  useEffect(() => {
    var tempPrice = 0;
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

  // console.log(identicalElements);
  // console.log(tempPrice.toFixed(2))

  const goToSelectDeliveryScreen = () => {
    if (totalPrice > 0) {
      navigation.navigate('SelectDeliveryAddressScreen');
    } else {
      ToastAndroid.show(
        "You don't have any item. Please go back and select something.",
        ToastAndroid.SHORT,
      );
    }
  };
  const suggestionDailogHandler = (
    id,
    title,
    price,
    description,
    image_src,
    isFavourite,
    isVeg,
  ) => {
    setIsVisible(true);
    setItem({
      id: id,
      title: title,
      price: price,
      description: description,
      image_src: image_src,
      isFavourite: false,
      isVeg: isVeg,
    });
  };

  const hideDialog = () => {
    setIsVisible(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          data={proData}
          renderItem={({item}) => (
            <CartSingleMenuItem
              id={item.id}
              title={item.title}
              description={item.description}
              image_src={item.image_src}
              price={item.price.toFixed(2)}
              count={item.count}
              isVeg={item.isVeg}
            />
          )}
          keyExtractor={(item, index) => item.id.toString()}
          contentContainerStyle={proData.length === 0 && Styles.centerEmptySet}
          ListEmptyComponent={
            <EmptyDataScreen
              title={'Empty'}
              description={'Opps, Your cart is empty...'}
            />
          }
        />
      </View>

      <SuggestionDailog
        visible={isVisible}
        item={item}
        onHideDialog={hideDialog}
      />
      <View
        style={{
          flexDirection: 'column',
          height: 300,
          backgroundColor: '#ffffff',
          justifyContent: 'space-between',
        }}>
        <Text style={[Styles.customFontMedium, {marginLeft: 8, marginTop: 8}]}>
          You may also like
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <SuggestionSingleItem
                id={item.id}
                title={item.title}
                description={item.description}
                image_src={item.image_src}
                price={item.price.toFixed(2)}
                count={item.count}
                isVeg={item.isVeg}
                onSelectedDialogItem={suggestionDailogHandler}
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
            horizontal={true}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={Styles.customFontMedium}>Food order value: </Text>
          <Text style={(Styles.customFontMedium, {color: 'green'})}>
            EGP {totalPrice}
          </Text>
        </View>
        <TouchableOpacity
          onPress={goToSelectDeliveryScreen}
          style={Styles.appButtonContainer}>
          <Text style={[Styles.customFontMedium, Styles.appButtonText]}>
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
