import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { SERVEUR } from '@env';
import React, { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";

const CreateGroup = ({ navigation, user }) => {
  const [groupName, setGroupName] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const userId = user.user.ID;
  const myUserInfo = user.user
  // console.log("mon image?", image);
  


  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasPermission(status === "granted");
    console.log(status);
    return status === "granted";
  }, []);

  const pickGroupImage = async () => {
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
      // console.log("Image sélectionnée:", result.assets[0].uri);
      // console.log("Image format:", result.assets[0].mimeType);
      // console.log("Nom de l'Image :", result.assets[0].fileName);
      // console.log("Type de l'Image:", result.assets[0].type);
      // console.log("", result.assets[0].exif);
    }
  };

  const createGroupWithImage = async () => {
    const formData = new FormData();
    formData.append("Avatar", {
      uri: image,
      type: imageType,
      name: imageName,
    });
    formData.append("Name", groupName)
    // console.log(formData._parts[1]);
    

    if(formData._parts[1] != ""){
      try {
        const response = await fetch(
          `${SERVEUR}/group/createGroup/${userId}`,
            {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
        );
  
        if (!response.ok) {
          throw new Error(
            `Erreur lors de la création du groupe (statut ${response.status})`
          );
        }
        if (response.status === 200) {
          Alert.alert("Groupe créer avec succès");
          navigation.navigate("bottomNavGroup");
        }
  
        const newGroup = await response.json();
        console.log("Nouveau groupe:", newGroup.group);
      } catch (error) {
        console.error("Erreur lors de la création du groupe", error);
      }
    }else{
      Alert.alert("Veuillez entrer un nom de groupe");
      console.log("pas de nom de groupe");
    }

  };

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "black" }}>
      <View style={[styles.childBox, image && !null ?  styles.withPic : styles.withoutPic]}>
        <Text style={styles.customButton}>Nom du groupe :</Text>
        <TextInput
          style={{
            fontSize: 20,
            color: "white",
            textAlign: "center",
            paddingTop: 10,
          }}
          placeholder="Entrez le nom du groupe"
          placeholderTextColor={"#898989"}
          value={groupName}
          onChangeText={setGroupName}
        />        
        <Button title="Choisir une image" onPress={pickGroupImage}/>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity onPress={createGroupWithImage}>
          <Text style={styles.customButton}>Créer le groupe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CreateGroup;

const styles = StyleSheet.create({
  childBox:{
    flexDirection: "colum", 
    height:"30%",
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    top: 200, 
    backgroundColor: "#202020", 
    borderRadius:10,
  },
  withPic:{
    height:"45%",
  },
  withoutPic:{
    height:"30%",
  },
  customButton: {
    color: "white",
    fontSize: 30,
    width:"90%",
    fontWeight: "bold",
    backgroundColor: "#898989",
    padding: 10,
    margin: 5,
    textAlign: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
