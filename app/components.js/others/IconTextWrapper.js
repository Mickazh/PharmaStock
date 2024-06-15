import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const IconTextWrapper = ({icon,text,style}) => {
  return (
    <View style={[styles.container,style]}>
        <View style={styles.icon}> 
            {icon}
        </View>
        <View style={styles.text}>
            {text}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        width: "15%",

    },
    text:{
        width: "70%",
    }
})

export default IconTextWrapper