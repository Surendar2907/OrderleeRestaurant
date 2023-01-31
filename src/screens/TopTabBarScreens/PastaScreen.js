import React, {useState, useEffect} from 'react';
import {Button, View, Text, SafeAreaView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {setGlobal, useGlobal} from 'reactn';
import {
  useFirstRender,
  getFilterDataOfCategory,
  getFilterDataOfVegOrAll,
} from '../../components/SharedFunction';
import SingleMenuItem from '../../components/SingleMenuItem';
import Styles from '../../styles/Styles';
import EmptyDataScreen from '../EmptyData/EmptyDataScreen';

const PastaScreen = ({navigation}) => {
  const firstRender = useFirstRender();
  const [veg, setVeg] = useGlobal('setVeg');
  const [data, setData] = useGlobal('Data');
  const [finalList, setFinalList] = useState([]);

  useEffect(() => {
    const cleanup = setFinalList(getFilterDataOfCategory('meal', data));
    return () => {
      cleanup;
    };
  }, [data]);

  useEffect(() => {
    if (!firstRender) {
      const cleanup = setFinalList(getFilterDataOfVegOrAll(veg, finalList));
      return () => {
        cleanup;
      };
    }
  }, [veg]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={finalList}
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
        contentContainerStyle={finalList.length === 0 && Styles.centerEmptySet}
        ListEmptyComponent={
          <EmptyDataScreen
            title={'Empty'}
            description={'No Dish in This Categroy'}
          />
        }
      />
    </SafeAreaView>
  );
};

export default PastaScreen;
