import  {IP}  from '@env';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFormik } from "formik";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";

const {width, height} = Dimensions.get("window");

const Login = ({ navigation }) => {
  // console.log("test ip", IP);

  const formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
      Device: "",
      Os: "",
    },
    validate: (values) => {
      const errors = {};
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
        const apiUrl = `http://${IP}:3001/auth/login`;

        console.log(
          "log 1",
          Platform.isPad
            ? "TABLET"
            : "MOBILEPHONE"
        );
        console.log("log 2", Platform.OS);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Email: values.Email.toLowerCase(),
            Password: values.Password,
            Device:
              Platform.isPad || Platform.isPad == "undefined"
                ? "TABLET"
                : "MOBILEPHONE",
            Os: Platform.OS.toUpperCase(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Erreur de réseau (statut ${response.status})`);
        }

        const responseData = await response.json();
        console.log("Données envoyées avec succès", responseData);
        formik.resetForm();
        navigation.navigate("PageConfirmation", responseData);
        // Alert.alert("vous êtes connecté");
      } catch (error) {
        console.log("erreur", error);
        console.error("Erreur lors de l'envoi des données", error.message);
      }
    },
  });

  const onPress = () => {
    formik.handleSubmit();
  };

  const isFormValid = formik.values.Password.length > 0;

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enableOnAndroid={true}
      extraScrollHeight={40} // Ajustez selon les besoins
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.form}
    >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.Email}
              placeholder="Email"
              placeholderTextColor="white"
              value={formik.values.Email}
              onChangeText={formik.handleChange("Email")}
            />
          </View>
            {formik.errors.Email ? (
              <Text style={styles.errorText}>{formik.errors.Email}</Text>
            ) : null}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.MotDePasse}
              placeholder="Mot de passe"
              placeholderTextColor="white"
              secureTextEntry
              value={formik.values.Password}
              onChangeText={formik.handleChange("Password")}
            />
          </View>
            {formik.errors.Password ? (
              <Text style={styles.errorText}>{formik.errors.Password}</Text>
            ) : null}
        </View>
        <TouchableOpacity
          style={[
            styles.customButton,
            !isFormValid && styles.disabledButton,
          ]}
          onPress={onPress}
          disabled={!isFormValid}
        >
          
          <Text style={styles.buttonText}>SE CONNECTER</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            top:5 
          }}
        >
          <Text style={{ color: "white"}}>Vous n'avez pas de compte ?</Text>
          <TouchableOpacity style={styles.signUp} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signUpText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: height,
    gap: 20,
    alignItems: "center",
    height: height,
    backgroundColor:"black",
    paddingTop:150 
},
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputWrapper: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: width * 0.9,
    marginBottom: 10,
  },
  Email: {
    padding: 10,
    margin: 5,
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  MotDePasse: {
    padding: 10,
    margin: 5,
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  customButton: {
    borderBottomColor: "black",
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    marginTop: 20,
    borderRadius: 8,
    width: "90%",
  },
  disabledButton: {
    backgroundColor: "lightgray",
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 5,
  },
  signUp:{
    left:5,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
  signUpText:{
    color:"white",
  }, 
});