import React from 'react';
import {ToastAndroid} from 'react-native';

const ShowToast = (props) => {
  ToastAndroid.show(props, ToastAndroid.SHORT);
};

export default ShowToast;
