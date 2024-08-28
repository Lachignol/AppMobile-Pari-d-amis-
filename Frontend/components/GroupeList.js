import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { SERVEUR } from '@env';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const MyGroupScreen = ({ navigation, user }) => {
  console.log("test ip 2", IP);
  const userID = user.user.ID
  console.log(userID);
  const [allgroupsOfUser, setAllGroupsOfUser] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const requestGroup = async () => {
        let requete = await axios.get(
          `${SERVEUR}/user/groupsOfOneUser/${userID}`
        );
        // console.log(requete.data);
        if (requete.data) setAllGroupsOfUser(requete.data.UserGroup);
      };
      requestGroup();
    }, [])
  );

  const viewGroupDetails = (group) => {
    navigation.navigate("GroupeDetails", group);
  };

  return (
    <ScrollView> 
    <View
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "white",
        height: height,
      }}
    >
      <View style={{ flexDirection: "colum" }}>
        <Text style={{  fontSize: 20, paddingTop: 150, color: "black",fontWeight:"bold" }}>
          Nom du groupe :
        </Text>
      
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={styles.buttonText}>Créer le groupe</Text>
        </TouchableOpacity>
      </View>

      {allgroupsOfUser?.map((group) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("MyTopTabs", group)}
          key={group.ID}
        >
          <Text style={styles.detailcCustomButton}>{group.Name}</Text>
          <Text style={{ color: "white", fontSize: 20,fontWeight:"bold", marginTop:5, }}>
            {group.LimitMembers}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    </ScrollView>
  );
};

export default MyGroupScreen;
const styles = StyleSheet.create({
  detailcCustomButton: {
    backgroundColor: "white",
    padding: 5,
    marginTop: 20,
    width: "100%",
    color: "black",
    fontSize: 20,
    fontWeight:"bold",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    textAlign:"center",
  
  },
  detailButtonText: {
    color: "white",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
    fontSize: 15,
   
  },
  customButton: {
   
    backgroundColor: "white",
    padding: 5,
    margin: 5,
    marginTop: 20,
    borderRadius: 8,
    width: "40%",
    bottom: 40,
    left: 220,
    
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
    fontSize: 15,
  },
});
