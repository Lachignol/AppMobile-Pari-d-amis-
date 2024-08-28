import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SERVEUR } from '@env';
import React, { useState } from "react";

const CreateGroup = ({ navigation, user }) => {
  const [groupName, setGroupName] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState("");
  const userId = user.user.ID;

  const createGroupAndNavigate = async () => {
    const membersCount = parseInt(numberOfMembers, 10);

    if (isNaN(membersCount) || membersCount <= 0) {
      alert("Veuillez entrer un nombre de membres valide.");
      return;
    }

    try {
      const response = await fetch(
        `${SERVEUR}/group/createGroup/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: groupName,
            LimitMembers: membersCount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la création du groupe (statut ${response.status})`
        );
      }
      if (response.status === 200) {
        Alert.alert("Groupe créer avec succès");
        navigation.navigate("Groupes");
      }

      const newGroup = await response.json();
      console.log("Nouveau groupe:", newGroup.group);
    } catch (error) {
      console.error("Erreur lors de la création du groupe", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "black" }}>
      <View style={{ flexDirection: "colum", top: 200 }}>
        <Text style={styles.customButton}>Nom du groupe :</Text>
        <TextInput
          style={{
            fontSize: 20,
            color: "white",
            textAlign: "center",
            paddingTop: 10,
          }}
          placeholder="Entrez le nom du groupe"
          placeholderTextColor={"red"}
          value={groupName}
          onChangeText={setGroupName}
        />
        <Text style={styles.customButton}>Nombre de membres :</Text>
        <TextInput
          style={{
            fontSize: 20,
            color: "white",
            textAlign: "center",
            paddingTop: 10,
          }}
          placeholder="Entrez le nombre de membres"
          placeholderTextColor={"red"}
          value={numberOfMembers}
          onChangeText={setNumberOfMembers}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={createGroupAndNavigate}>
          <Text style={styles.customButton}>Créer le groupe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default CreateGroup;

const styles = StyleSheet.create({
  customButton: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    backgroundColor: "red",
    padding: 5,
    margin: 5,
    marginTop: 20,
    textAlign: "center",
    borderColor: "red",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
});
