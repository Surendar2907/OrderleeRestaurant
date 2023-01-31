import React,{useState} from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Styles from '../styles/Styles';

const CustomInputText = props => {
    const [focus, setFocus] = useState(true);
    return (
    <TextInput
        setFocus={focus} //whatever focus state holds
        onChangeText={text => console.log(text)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={styles.textInput}
        placeholder={props.placeholder} />)

}

const styles = StyleSheet.create({
    focused: {
        fontFamily: 'Gotham-Book',
        fontSize: 14,
        color: '#8f949d',
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        borderWidth: 1,
    },
    textInput:
    {
        borderRadius: 5,
        paddingLeft: 15,
        fontFamily: 'Gotham-Book',
        width: 290
    },
    notFocused: {
        fontFamily: 'Gotham-Book',
        fontSize: 12,
        color: '#8f949d',
        backgroundColor: '#cdced2'
    },
    container: {
        flexDirection: 'row',
        borderRadius: 5,
        width: 312,
        justifyContent: 'center',
        padding: 3,
        alignItems: 'center',
        height: 50
    },
    inputStyle: {
        flex: 1,
    },
})

export default CustomInputText;