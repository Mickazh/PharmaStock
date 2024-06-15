import React, { useState,useEffect, useRef,useCallback } from 'react';

import { View, Text, TouchableOpacity, Animated,StyleSheet,Dimensions, Button , Modal} from 'react-native';
import Colors from '../../Utils/Colors';

export const PopUpMiddle = ({isVisible,setIsVisible,contentView}) => {
  // console.log(isVisible);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideIn = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsVisible(true);

  });

  const slideOut = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(()=>{setIsVisible(false);});
  });

  const interpolatedTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  });


  useEffect(() => {
    if(isVisible){
      slideIn();
    }

  }, [isVisible]);

  return (
    <Modal
    transparent={true}
    visible={isVisible}
    onRequestClose={slideOut}
    animationType="none"
  >
     <View style={stylesPopupMiddle.overlay}>
        <Animated.View style={[stylesPopupMiddle.container, { transform: [{ translateY: interpolatedTranslateY }] }]}>
          <View style={stylesPopupMiddle.contentContainer}>
            {contentView}
          </View>
          <TouchableOpacity onPress={slideOut} style={stylesPopupMiddle.button}>
            <Text style={stylesPopupMiddle.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
  </Modal>
  );
};


export const PopUpSignalement = ({isVisible,setIsVisible,contentView}) => {
  // console.log(isVisible);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideIn = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsVisible(true);

  });

  const slideOut = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(()=>{setIsVisible(false);});
  });

  const interpolatedTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  });


  useEffect(() => {
    if(isVisible){
      slideIn();
    }

  }, [isVisible]);

  return (
    <View>
      {isVisible && (
        <Animated.View style={[stylesPopupMiddle.container,{transform:[{translateY:interpolatedTranslateY}]}]}>
        <Button onPress={()=>{slideOut()}} title='fermer'></Button>
        {contentView}
      </Animated.View>
      )}
    </View>
  );
};

// CLASSE INCOMPLETE NE PAS UTILISER OU DEBUGGER LA //

export const PopUpTopToBottom = ({isVisible,setIsVisible,contentView,closeButtonStyle,touchableOpacityInner}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideIn = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsVisible(true);

  });

  const slideOut = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(()=>{setIsVisible(false);});
  });

  const interpolatedTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0,Dimensions.get("window").height-150],
  });
  

  useEffect(() => {
    if(isVisible){
      slideIn();
    }

  }, [isVisible]);

  return (
    <View>
      {isVisible && (
        <Animated.View style={[styles.container,{transform:[{translateY:interpolatedTranslateY}]}]}>
        <View style={styles.contentViewStyle}>
          {contentView}

        </View>
        <TouchableOpacity style={[styles.defaultButtonStyle,closeButtonStyle]} onPress={slideOut} >
          {touchableOpacityInner}
        </TouchableOpacity>

      </Animated.View>
      
      )}
    </View>
  );
};
PopUpTopToBottom.defaultProps={
  touchableOpacityInner:<Text>fermer</Text>,

}

const stylesPopupMiddle = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    width: 300,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  contentContainer: {
    marginBottom: 20, 
  },

  button: {
    backgroundColor: Colors.vertFonce,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

const styles= StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    alignItems: "center",
    flexDirection: "row",
  },
  contentViewStyle:{
    height: "80%",
    width: "100%",
  },
  defaultButtonStyle:{
    padding: 10,
  }
}) 

// {transform:[{translateY:interpolatedTranslateY}]}
