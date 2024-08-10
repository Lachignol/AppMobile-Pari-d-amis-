import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, Button, Image,Alert} from 'react-native'
import React, { useState, useCallback,useEffect } from 'react'
import { IP } from '@env';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

const Account = ({setUser, user}) => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const User = user.user

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);
 
  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === 'granted');
    console.log(status)
    return status === 'granted';
  }, []);


  const [state, setState] = useState({
    Pseudo: User.Pseudo,
    Firstname: User.Firstname
  });

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
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
      setImageType(result.assets[0].type)
      console.log("Image sélectionnée:", result.assets[0].uri);
      console.log("Nom de l'Image :", result.assets[0].fileName);
      console.log("Type de l'Image:", result.assets[0].fileName)
      console.log("",result.assets[0].exif);
    } else {
      resetImagePicker()
    }
  };

  const resetImagePicker = useCallback(() => {
    setImage(null);
    setImageName(null);
    setImageType(null);
  }, []);

  const uploadImage = async () => {
    setErreur(null)
    console.log("Début");
    if (!image) {
      console.log("Pas d'image sélectionnée");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('Avatar', {
      uri: image,
      type: imageType,
      name: imageName
    });

    try {
      console.log(`Envoi de la requête à : http://${IP}:3001/user/updateAvatarOfUser/${User.ID}`);
      const response = await fetch(`http://${IP}:3001/user/updateAvatarOfUser/${User.ID}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Statut de la réponse:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        if(response.status == 424 ){
          setErreur(`Pas d'image trouvé avez-vous autorisez celle-ci ?`)
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const result = await response.json();
      Alert.alert("Succès", "L'image a été uploadée avec succès.");
      
      setUser(prevUser => ({
        ...prevUser,
        user: {
          ...prevUser.user,
          PathOfAvatar: imageName
        }
      }))
      resetImagePicker();
    } catch (error) {
      console.error('Erreur:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Account</Text>
      <TouchableOpacity style={styles.customButton} onPress={async()=>{
        await SecureStore.deleteItemAsync("user")
        setUser(null)
      }}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        value={state.Pseudo}
        onChangeText={(txt)=>handleInputChange("Pseudo",txt)}
      />
      <TextInput
        style={styles.input}
        placeholder="Firstname"
        value={state.Firstname}
        onChangeText={(txt)=>handleInputChange("Firstname",txt)}
      />

      <View style={styles.imageContainer}>
        <Button title="Choisir une image" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        {erreur && <Text style={styles.errorText}>{erreur}</Text>}

    
        <Button 
          title={isLoading ? "Chargement..." : "Envoyer l'image"}
          onPress={uploadImage}
          disabled={isLoading}
        />
      </View>

      <Image 
        source={{ uri: `http://${IP}:3001/static/avatar/${User.PathOfAvatar}`}}
        style={styles.avatar}
      />
    </SafeAreaView>
  )
}

export default Account

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  customButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 5,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});