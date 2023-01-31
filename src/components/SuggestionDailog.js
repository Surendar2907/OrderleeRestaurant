import React, {useRef, useState} from 'react';
import {Modal, TouchableWithoutFeedback, View} from 'react-native';
import SingleMenuItem from './SingleMenuItem';

const SuggestionDailog = ({visible, item, onHideDialog}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
      visible={visible}>
      <TouchableWithoutFeedback onPressOut={() => onHideDialog()}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{borderRadius: 10, backgroundColor: 'white', width: '85%'}}>
            <SingleMenuItem
              id={item.id}
              title={item.title}
              description={item.description}
              image_src={item.image_src}
              price={item.price}
              count={item.count}
              isFavourite={item.isFavourite}
              isVeg={item.isVeg}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuggestionDailog;
