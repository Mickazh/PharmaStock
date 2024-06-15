import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Dimensions,Text } from 'react-native';
import { Bounce } from 'react-native-animated-spinkit';
import Colors from '../../Utils/Colors';
const LoadingBounce = ({text}) => {
  return (
    <View style={styles.container}>
        <Text>{text}</Text>
        <Bounce size={100} color={Colors.vertFonce}/>

    </View>
  );
};
LoadingBounce.defaultProps={
    text: 'Chargement en cours...', 
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',     
      },

});

export default LoadingBounce;