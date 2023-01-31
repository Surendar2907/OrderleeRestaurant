import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import HTML from 'react-native-render-html';
import {makeRequest} from '../../apis/Api';
import GlobalAppDashboardModel from '../../models/AppDashboardModel';
import Styles from '../../styles/Styles';

const AboutUsSCreen = ({navigation}) => {
  const [htmlContent, setHtmlContent] = useState(
    GlobalAppDashboardModel.getAbout().content,
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.item}>
          <Image
            source={require('../../../images/orderlee_logo.png')}
            style={styles.icon}
          />
          <HTML style={Styles.customFontSmall} source={{html: htmlContent}} />
          {/* <Text style={Styles.customFontSmall}>
            Orderlee brings you the most lip-smacking food on-demand within
            30-40 minutes of your order. We constantly strive to offer you all
            day meal experiences to keep your hunger pangs at bay. Currently, we
            are delivering in 14 select locations in Mumbai, i.e., Bandra West,
            BKC, Kalina, Vakola, Bandra East, Mahim, Matunga, Dadar, Kurla,
            Ghatkopar, LBS Road, Vidyavihar, Wadala, Dadar East. If we cannot
            cater to you yet, rest assured we will soon be ready to deliver you
            at your doorstep!
          </Text> */}
          {/* <Text style={Styles.customFontMediumBold}>
            {'\n'}Lunch Delivery Timing: 12 noon to 3 pm.
          </Text>
          <Text style={Styles.customFontMediumBold}>
            {'\n'}Dinner Delivery Timing: 7 pm to 10:30 pm
          </Text> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },

  item: {
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'column',
  },
  icon: {
    resizeMode: 'contain',
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
});

export default AboutUsSCreen;
