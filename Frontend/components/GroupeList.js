import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { SERVEUR } from '@env';
import {
  Image,
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
  const userID = user.user.ID
  console.log(userID);
  const [allgroupsOfUser, setAllGroupsOfUser] = useState([]);
  allgroupsOfUser.map((group) => {
    console.log("group?",group.PathOfGroupAvatar);
  });
  
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
    <>
    <View
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        height: height,
      }}
      >
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
                  style={styles.ImageLogo}
                  source= {require("../assets/logoBlanco.png")}
                  />
         </View>
      <View style={styles.createGroupButton}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate("CreateGroup")}
          >
          <Text style={styles.buttonText}>Créer un groupe</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.viewOfScrollView}>
          <ScrollView contentContainerStyle={styles.theGroupScrollView}> 
      {allgroupsOfUser?.map((group) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("MyTopTabs", group)}
          key={group.ID}
        >
          <View style={styles.detailcCustomButton}>
          <Text style={{color:"#898989"}}>{group.Name}:</Text>
          <Text style={{ color: "#898989", fontSize: 20,fontWeight:"bold" }}>
            {group.LimitMembers}
          </Text>
          <Image 
            style={styles.imageGroup}
            source={{ uri: `${SERVEUR}/static/avatar/${group.PathOfGroupAvatar}` }}
          ></Image>
          </View>
        </TouchableOpacity>
      ))}
      </ScrollView>
        </View>
    </View>
</>
  );
};

export default MyGroupScreen;
const styles = StyleSheet.create({
  ImageLogo:{
    top:70,
    height:90,
    width:"55%",
    alignItems: "center",
  },
  createGroupButton:{
    
  },
  customButton: {
    backgroundColor: "#000000",
    marginTop: 20,
    borderRadius: 8,
    width:"35%",
    alignSelf:"center",
    fontWeight:"bold",
    borderBottomColor: '#202020',
    borderBottomWidth: 2,  
  },
  viewOfScrollView:{
    height:'75%'
  },
  theGroupScrollView:{
    alignItems:"center",
  },
  detailcCustomButton: {
    backgroundColor: "#202020",
    padding: 5,
    marginTop: 20,
    marginBottom:10,
    width: "95%",
    height:40,
    color: "black",
    fontSize: 20,
    fontWeight:"bold",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
    overflow: "hidden",  
  },
  buttonText: {
    color: "#898989",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
    fontSize: 15,
  },
  imageGroup:{
    height:50,
    width:50,
  }
});
