import  {IP}  from '@env';
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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.form}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={styles.Login}>Login</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.Email}
              placeholder="Email"
              placeholderTextColor="black"
              value={formik.values.Email}
              onChangeText={formik.handleChange("Email")}
            />
            {formik.errors.Email ? (
              <Text style={styles.errorText}>{formik.errors.Email}</Text>
            ) : null}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.MotDePasse}
              placeholder="Password"
              placeholderTextColor="black"
              secureTextEntry
              value={formik.values.Password}
              onChangeText={formik.handleChange("Password")}
            />
            {formik.errors.Password ? (
              <Text style={styles.errorText}>{formik.errors.Password}</Text>
            ) : null}
          </View>
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
          }}
        >
          <Text style={{ color: "black" }}>Vous n'avez pas de compte ?</Text>
          <Button
            title="S'inscrire"
            color="blue"
            titleStyle={{ textAlignVertical: "center" }}
            onPress={() => navigation.navigate("Signup")}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: "blue" }}>Mot de passe oublié</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  Login: {
    color: "black",
    bottom: 50,
    fontSize: 30,
    padding: 5,
    margin: 5,
    fontWeight: "800",
    textAlign: "center",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    gap: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputWrapper: {
    width: windowWidth * 0.9,
    marginBottom: 10,
  },
  Email: {
    borderWidth: 1,
    borderBottomColor: "black",
    padding: 10,
    margin: 5,
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
  MotDePasse: {
    borderWidth: 1,
    borderBottomColor: "black",
    padding: 10,
    margin: 5,
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
  customButton: {
    borderBottomColor: "black",
    backgroundColor: "black",
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
    color: "white",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 5,
  },
});