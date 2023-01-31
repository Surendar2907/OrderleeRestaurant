import React, {useState, useEffect} from 'react';
import {View, Text, Modal, ActivityIndicator} from 'react-native';

const CustomProgressBar = ({visible, placeholder}) => (
  <Modal
    animationType="fade"
    transparent
    presentationStyle="overFullScreen"
    onRequestClose={() => null}
    visible={visible}>
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{borderRadius: 10, backgroundColor: 'white', padding: 25}}>
        <Text style={{fontSize: 20, fontWeight: '200'}}>{placeholder}</Text>
        <ActivityIndicator animating={true} size="large" color="#f4511e" />
      </View>
    </View>
  </Modal>
);

export default CustomProgressBar;
