import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const OurServiceAreaScreen = ({ id }) => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 19.2140408,
                        longitude: 72.9314192,
                        latitudeDelta: 0.015 * 35,
                        longitudeDelta: 0.0121 * 35,
                    }}

                >
                    <Marker
                        key={101}
                        coordinate={{ latitude: 19.2140408, longitude: 72.9314192 }}
                        title={'Orderlee'}
                        description={''}
                    />
                </MapView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default OurServiceAreaScreen;