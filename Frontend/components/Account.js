import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Button,
  Image,
  Alert,
  RefreshControl,
  ScrollView,
  RefreshControlComponent,
} from "react-native";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useFocusEffect,
} from "react";
import { SERVEUR } from "@env";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import TopBar from "react-native-vector-icons/FontAwesome6";

const Account = ({ setUser, user, navigation }) => {
  const User = user.user;
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(User.PathOfAvatar);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === "granted");
    console.log(status);
    return status === "granted";
  }, []);

  const [state, setState] = useState({
    Pseudo: User.Pseudo,
    Firstname: User.Firstname,
  });

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const pickImage = async () => {
    let permissionResult = hasPermission;
    if (permissionResult === null) {
      permissionResult = await requestPermission();
    }

    if (!permissionResult) {
      Alert.alert(
        "Permission refusée",
        "Nous avons besoin de votre permission pour accéder à vos photos.",
        [{ text: "OK" }]
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
      setImageType(result.assets[0].type);
      console.log("Image sélectionnée:", result.assets[0].uri);
      console.log("Image format:", result.assets[0].mimeType);
      console.log("Nom de l'Image :", result.assets[0].fileName);
      console.log("Type de l'Image:", result.assets[0].type);
      console.log("", result.assets[0].exif);
    } else {
      resetImagePicker();
    }
  };

  const resetImagePicker = useCallback(() => {
    setImage(null);
    setImageName(null);
    setImageType(null);
  }, []);

  const uploadImage = async () => {
    setErreur(null);
    console.log("Début");
    if (!image) {
      console.log("Pas d'image sélectionnée");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("Avatar", {
      uri: image,
      type: imageType,
      name: User.Pseudo,
    });

    try {
      console.log(
        `Envoi de la requête à : ${SERVEUR}/user/updateAvatarOfUser/${User.ID}`
      );
      const response = await fetch(
        `${SERVEUR}/user/updateAvatarOfUser/${User.ID}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Statut de la réponse:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status == 424) {
          setErreur(`Pas d'image trouvé avez-vous autorisez celle-ci ?`);
        }
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const result = await response.json();
      Alert.alert("Succès", "L'image a été uploadée avec succès.");
      setShowImage(false);
      console.log("mon result ?", result);
      
      setUser((prevUser) => ({
        ...prevUser,
        user: {
          ...prevUser.user,
          PathOfAvatar: result.message.PathOfAvatar,
        },
      }));
      console.log(User.user);
      setShowImage(true);
      resetImagePicker();
    } catch (error) {
      console.error("Erreur:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>
          <TopBar name="bars" size={30} />:
        </Text>
        {showImage && (
          <Image
            style={styles.avatar} 
            source={{ uri: User.PathOfAvatar }}
          />
        )}
        <View style={styles.imageContainer}>
          <Button title="Choisir une image" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {erreur && <Text style={styles.errorText}>{erreur}</Text>}

          <Button
            title={isLoading ? "Chargement..." : "Modifier la photo de profil"}
            onPress={uploadImage}
            disabled={isLoading}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Pseudo"
          value={state.Pseudo}
          onChangeText={(txt) => handleInputChange("Pseudo", txt)}
        />
        <TextInput
          style={styles.input}
          placeholder="Firstname"
          value={state.Firstname}
          onChangeText={(txt) => handleInputChange("Firstname", txt)}
        />
        <TouchableOpacity
          style={styles.customButton}
          onPress={async () => {
            await SecureStore.deleteItemAsync("user");
            setUser(null);
          }}
        >
          <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  customButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 5,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
});
