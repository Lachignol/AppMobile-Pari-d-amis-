import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
//import React from 'react'

//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const PageConfirmation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pa}>PA</Text>
      <Text style={styles.soumettre}>Votre pari est soumis.</Text>
      <View style={{ top: 200 }}>
        <Button
          title="TERMINER"
          color="red"
          colorText="white"
          borderRadius="30px"
          width="50px"
          onPress={() => navigation.navigate("MyTabs")}
        />
      </View>
    </View>
  );
};

export default PageConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  pa: {
    color: "red",
    textAlign: "center",
    fontSize: 100,
    fontWeight: "bold",
  },
  soumettre: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
});