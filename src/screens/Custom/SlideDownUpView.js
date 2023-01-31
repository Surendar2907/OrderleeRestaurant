import React, { Component } from 'react';
import { Text, View, StyleSheet, LayoutAnimation, Platform, UIManager, TouchableOpacity, Image } from 'react-native';
import Styles from '../../styles/Styles'

export default class SlideDownUpView extends Component {
  constructor() {
    super();

    this.state = { expanded: false }

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <View style={styles.container}>
        <View >
          <TouchableOpacity activeOpacity={1} onPress={this.changeLayout} style={styles.btnContainer}>
          <Image
              source={require('../../../images/contact_n.png')}
              // source={{uri: 'about_n'}}
              style={{
                width: 24,
                height: 24,
                marginLeft:9
              }}
           />   
           <View style={{flex:1,marginLeft:32,}}>
              <Text style={styles.btnText}>Contact Us</Text>
           </View>
          </TouchableOpacity>
          <View style={{ height: this.state.expanded ? null : 0, overflow: 'hidden' }}>
            <View style={styles.expandContainer}>
              <Text>
                <Text style={Styles.customFontNormalBold}>Email id: </Text>
                <Text style={Styles.customFontNormal}>contact@augmatrixlab.com</Text> 
              </Text>
              <Text>
                <Text style={Styles.customFontNormalBold}>Web: </Text>
                <Text style={Styles.customFontNormal}>www.orderlee.co</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },

  text: {
    fontSize: 17,
    color: 'black',
    padding: 10
  },

  btnText: {
    color: '#6b6b6b',
    fontSize: 16,
    fontFamily: "Gotham-Book"
  },

  

  btnContainer:{
    flex:1,
    alignItems:'center',
    flexDirection: 'row',
    marginTop:8,
    marginBottom:8
  },
  expandContainer:{
    padding:2
  },

  Btn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});