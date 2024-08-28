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
        <Text style={styles.connecter}>Vous êtes connecté.</Text>
       <View 
       style={{top:200}}
       >
           <TouchableOpacity style={styles.customButton} onPress={async () =>{
            await SecureStore.setItemAsync("user", JSON.stringify(obj))
            setUser(obj)
           }}>
          <Text style={styles.buttonText}>TERMINER</Text>
          </TouchableOpacity>
          </View>
    </View>
  );
};

export default PageConfirmation;

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: "black",
      alignItems:"center",
    },
    Confirmer:{
      color: "black",
      textAlign: "left",
      fontSize: 20,
      marginLeft: 30,
    },
    connecter:{
      color: "white",
      fontSize: 30,
      textAlign: "center",
      top:170
    },
    customButton: {
      backgroundColor: "white",
      padding: 10,
      margin: 5,
      borderRadius: 8,
      width: "100%",
    },
    buttonText: {
      color: "black",
      fontWeight: "700",
      alignItems: "center",
      textAlign: "center",
    },
})
