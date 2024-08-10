import React  from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View,TouchableOpacity} from 'react-native'
import * as SecureStore from 'expo-secure-store';


//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const PageConfirmation = ({ navigation, route, setUser }) => {
  const obj = route.params
  delete obj.message
  
  return (
    <View style={styles.container}>
        {/* <Text style={styles.Confirmer}>Confirmation</Text> */}
        <Text style={styles.pa}>PA</Text>
        <Text style={styles.connecter}>Vous êtes connecté.</Text>
       <View 
       style={{top:200}}
       >
           <TouchableOpacity style={styles.customButton} onPress={async () =>{
            await SecureStore.setItemAsync("user", JSON.stringify(obj))
            setUser(obj)
           }}>
          <Text style={styles.buttonText}> TERMINER</Text>
        </TouchableOpacity>
          </View>
    </View>
  );
};

export default PageConfirmation;

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: "white",
      alignItems:"center",
      
    },
    Confirmer:{
      color: "black",
      textAlign: "left",
      fontSize: 20,
      marginLeft: 30,
    },
    pa:{
      color: "black",
      textAlign: "center",
      fontSize: 100,
      fontWeight: "bold",
      top:100
      
    },
    connecter:{
      color: "black",
      fontSize: 30,
      textAlign: "center",
      top:120
    },
    customButton: {
      borderBottomColor: "black",
      backgroundColor: "black",
      padding: 10,
      margin: 5,
      marginTop: 20,
      borderRadius: 8,
      width: 350,
    },
    buttonText: {
      color: "white",
      fontWeight: "700",
      alignItems: "center",
      textAlign: "center",
    },
})
