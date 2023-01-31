import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const ImageCircleButton = props => (
    <TouchableOpacity
        style={{
            margin: props.margin,
            height: props.size,
            width: props.size,
            backgroundColor: props.color,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: props.size * 2,
            borderWidth: 1
        }}
        onPress={props.onPress}>
        {/* <Text style={{ color: props.textColor, fontSize: props.fontSize }}>
            {props.text}
        </Text> */}
        <Image
            source={require('../../images/plus_m.png')}
            style={{
                width: props.size - 10,
                height: props.size - 10,
                borderRadius: (props.size - 10) / 2
            }}
        />
    </TouchableOpacity>
);

export default ImageCircleButton;