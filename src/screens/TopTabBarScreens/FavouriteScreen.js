import React, {useEffect, useState} from 'react';
import {Button, View, Text, SafeAreaView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import SingleMenuItem from '../../components/SingleMenuItem';
import {setGlobal, useGlobal} from 'reactn';
import EmptyDataScreen from '../EmptyData/EmptyDataScreen';
import Styles from '../../styles/Styles';

const FavouriteScreen = ({navigation}) => {
  const [data, setData] = useGlobal('Data');
  const [newFavouriteData, setNewFavouriteData] = useState([]);

  useEffect(() => {
    let newArr = [];
    for (let index = 0; index < data.length; index++) {
      if (data[index].isFavourite === true) {
        newArr = [...newArr, data[index]];
      }
    }
    setNewFavouriteData(newArr);
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={newFavouriteData}
        renderItem={({item}) => (
          <SingleMenuItem
            id={item.id}
            title={item.title}
            description={item.description}
            image_src={item.image_src}
            price={item.price.toFixed(2)}
            count={item.count}
            isFavourite={item.isFavourite}
            isVeg={item.isVeg}
          />
        )}
        keyExtractor={(item, index) => item.id.toString()}
        contentContainerStyle={
          newFavouriteData.length === 0 && Styles.centerEmptySet
        }
        ListEmptyComponent={
          <EmptyDataScreen
            title={'Empty'}
            description={'No Favourite Dishes Yet'}
          />
        }
      />
    </SafeAreaView>
  );
};

export default FavouriteScreen;
