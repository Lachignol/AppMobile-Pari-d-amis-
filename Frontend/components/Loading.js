import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Image, StyleSheet, Text } from "react-native";
import nature from "../assets/nature.gif";


//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Loading = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const delay = setTimeout(() => {
         
        navigation.navigate('Overboard'); 
      }, 5000);
  
      return () => clearTimeout(delay);
    }, [navigation])
  );
    

  return (
    <View
      style={{ backgroundColor: "white", flex: 1, justifyContent: "center" }}
    >
      <Image style={styles.Image} source={require("../assets/nature.gif")} />
      <View style={styles.overlay}>
        <Text
          style={{
            color: "black",
            fontSize: 50,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Pari d'Amis
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  Image: {
    resizeMode: "cover",
    position: "absolute",

    height: "100%",
    width: "100%",
  },
  splashScreenMasterInstance: {
    width: "auto",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

});

export default Loading;
