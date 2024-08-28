import { IP } from '@env';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFormik } from "formik";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  StatusBar,
  Alert
} from "react-native";

//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Signup = ({ navigation }) => {
  // console.log("test ip", IP);

  const formik = useFormik({
    initialValues: {
      Firstname: "",
	    Lastname:"",
      Pseudo:"",
      Email: "",
      Password: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.Firstname) {
        errors.Firstname = "Veuillez entrer votre prénom";
      }
      if (!values.Lastname) {
        errors.Lastname = "Veuillez entrer votre nom";
      }
      if (!values.Pseudo) {
        errors.Pseudo = "Veuillez entrer votre pseudo";
      }
      if (!values.Email) {
        errors.Email = "Veuillez entrer votre adresse e-mail";
      }
      if (!values.Password) {
        errors.Password = "Veuillez entrer votre mot de passe";
      }
      return errors;
    },


    onSubmit: async (values) => {
      try {
        const apiUrl = `http://${IP}:3001/auth/signUp`;  // Remplacez par l'URL réelle de votre API
    
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Firstname: values.Firstname,
            Lastname: values.Lastname,
            Pseudo: values.Pseudo,
            Email: values.Email.toLowerCase(),
            Password: values.Password,
          })
         
          
        });
    
        if (!response.ok) {
          throw new Error(`Erreur de réseau (statut ${response.status})`);
        }
    
        const responseData = await response.json();
    
        console.log('Données envoyées avec succès', responseData);
    
        formik.resetForm();
        navigation.navigate('Login');
        Alert.alert("vous êtes inscrit")
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données', error);
      }
    },

  
  });
  const onPress = () => {
    formik.handleSubmit();
  };


  return (
    <View style={{ flex: 1, backgroundColor: "black"}}>
      <View style={styles.form}>
        <TextInput
          style={styles.text}
          placeholder="Prénom"
          placeholderTextColor="white"
          value={formik.values.Firstname}
          onChangeText={formik.handleChange("Firstname")}
        />
        <Text style={{ color: "red"}}>
          {formik.errors.Firstname}
        </Text>
        <TextInput
          style={styles.text}
          placeholder="Nom"
          placeholderTextColor="white"
          value={formik.values.Lastname}
          onChangeText={formik.handleChange("Lastname")}
        />
        <Text style={{ color: "red"}}>
          {formik.errors.Lastname}
        </Text>
        <TextInput
          style={styles.text}
          placeholder="Pseudo"
          placeholderTextColor="white"
          value={formik.values.Pseudo}
          onChangeText={formik.handleChange("Pseudo")}
        />
        <Text style={{ color: "red"}}>
          {formik.errors.Pseudo}
        </Text>
        <TextInput
          style={styles.text}
          placeholder="Email"
          placeholderTextColor="white"
          value={formik.values.Email}
          onChangeText={formik.handleChange("Email")}
        />
        <Text style={{ color: "red"}}>
          {formik.errors.Email}
        </Text>
        <TextInput
          style={styles.text}
          placeholder="Mot de passe"
          placeholderTextColor="white"
          secureTextEntry={true}
          value={formik.values.Password}
          onChangeText={formik.handleChange("Password")}
        />
        <Text style={{ color: "red"}}>
          {formik.errors.Password}
        </Text>
        <TouchableOpacity style={styles.customButton} onPress={onPress}>
          <Text style={styles.buttonText}>INSCRIPTION</Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>
            Vous avez déjà un compte ?
          </Text>
          <TouchableOpacity style={styles.signupBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 5,
  },
  customButton: {
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    marginTop: 20,
    borderRadius: 8,
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
    color:"black",
  },
  text: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    padding: 10,
    margin: 5,
    width: "90%",
    height: 50,
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  signupBtn:{
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    top:10,
  },
  btnText: {
    color:"white",
  },
});