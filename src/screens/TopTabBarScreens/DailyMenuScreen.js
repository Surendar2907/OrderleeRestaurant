import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView, ActivityIndicator} from 'react-native';
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

const DailyMenuScreen = ({navigation}) => {
  const firstRender = useFirstRender();
  const [veg, setVeg] = useGlobal('setVeg');
  const [data, setData] = useGlobal('Data');
  const [finalList, setFinalList] = useState([]);

  // const [ state, dispatch ] = useGlobal(reducer);

  // const reset = () => dispatch({ type: 'reset' });
  // const increment = () => dispatch({ type: 'increment' });
  // const decrement = () => dispatch({ type: 'decrement' });

  useEffect(() => {
    const cleanup = setFinalList(getFilterDataOfCategory('new arrival', data));
    return () => {
      cleanup;
    };
  }, [data]);

  useEffect(() => {
    if (!firstRender) {
      console.log(veg);
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

export default DailyMenuScreen;
