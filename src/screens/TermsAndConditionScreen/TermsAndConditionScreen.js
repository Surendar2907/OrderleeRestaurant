import React, {useState, useEffect} from 'react';
import {
  Button,
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import HTML from 'react-native-render-html';
import GlobalAppDashboardModel from '../../models/AppDashboardModel';
import Styles from '../../styles/Styles';

const DATA = [
  {
    title: 'TERMS AND CONDITIONS',
    description:
      'By making a purchase with us on this website/Mobile Application, you are agreeing to the following terms and conditions.',
  },
  {
    title: 'Prices',
    description:
      'Prices are exclusive of service taxes. On the occasion that any item is incorrectly priced, we reserve the right to cancel the purchase and relist the product at the correct price.' +
      'Your credit card information is not stored by us and is always processed across a secure server.',
  },
  {
    title: 'Privacy',
    description:
      'We only store necessary information required to make a purchase and do not sell or lease any of your personal information. All the information transacted with Orderlee website or Orderlee Mobile Application is entirely confidential.' +
      'Your credit card information is not stored by us and is always processed across a secure server.',
  },
  {
    title: 'Refunds Policy',
    description:
      'Orderlee is committed to ensuring your satisfaction with any product you have ordered from us. If you are not satisfied we will replace/refund as per your wish.',
  },
  {
    title: 'Copyright',
    description:
      'All text and images on Orderlee website or Orderlee Mobile Application remain copyright of Orderlee Restaurants Private Limited. Usage of any of this material is prohibited, unless authorized by the copyright holder. Ordelee Restaurants Private Limited is authorized to use all images that are used on Orderlee website and Mobile Application',
  },
  {
    title: 'Disclaimer',
    description:
      'It is your own responsibility to ensure to you are fully aware of all of these terms and conditions when making a purchase on Orderlee Mobile Application' +
      'Orderlee Restaurants Private Limited reserves the right to change / modify these terms and conditions at their own discretion anytime' +
      'The images shown are only indicative in nature and the actual product may vary in size, colour etc' +
      'Orderlee Restaurants Private Limited reserves the right to change any part of piece of information on website and Orderlee Mobile Application without any notice to customers or visitors',
  },
];

const TermsAndConditionScreen = ({navigation}) => {
  const [htmlContent, setHtmlContent] = useState(
    GlobalAppDashboardModel.getTnc().content,
  );

  const Item = ({title, description}) => (
    <View style={styles.item}>
      <Text style={Styles.customFontBig}>{title}</Text>
      <Text style={Styles.customFontSmall}>{description}</Text>
    </View>
  );

  const renderItem = ({item}) => (
    <Item title={item.title} description={item.description} />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <View style={{flex: 1}}>
        <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.title}
        />
      </View> */}
      <ScrollView style={{flex: 1}}>
        <View style={styles.item}>
          <HTML style={Styles.customFontSmall} source={{html: htmlContent}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'column',
  },
  title: {
    fontSize: 32,
  },
});

export default TermsAndConditionScreen;
