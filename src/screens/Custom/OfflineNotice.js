import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const {width} = Dimensions.get('window');

const OfflineNotice = () => {
  const [netInfo, setNetInfo] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isFirst, setIsFirst] = useState(true);
  useEffect(() => {
    const cleanup = setTimeout(() => {
      setIsFirst(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setNetInfo(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details.ipAddress}`,
      );
      changeLayout();
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe;
    };
  }, []);

  const getNetInfo = () => {
    // To get the network state once
    NetInfo.fetch().then((state) => {
      alert(
        `Connection type: ${state.type}
        Is connected?: ${state.isConnected}
        IP Address: ${state.details.ipAddress}`,
      );
    });
  };

  const changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const MiniOfflineSign = () => {
    return isFirst ? null : (
      <View style={{height: !isConnected ? null : 0, overflow: 'hidden'}}>
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      </View>
    );
  };

  return <MiniOfflineSign />;
};

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: 'darkred',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
  },
  offlineText: {color: '#fff'},
});

export default OfflineNotice;
