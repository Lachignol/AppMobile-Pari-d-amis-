import React, {useEffect, useState} from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { SERVEUR } from '@env';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import mainEventImage from '../assets/mainEvents.json';

const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Home = ( {navigation, user} ) => {

  const userId = user.user.ID
  console.log("userid?", userId);
  const [allGroupsOfUser, setAllGroupsOfUser] = useState([]);
  

  useFocusEffect(
    React.useCallback(() => {
      const requestGroup = async () => {
        let request = await axios.get(
          `${SERVEUR}/user/groupsOfOneUser/${userId}`
        );
        // console.log(request.data);
        if (request.data) setAllGroupsOfUser(request.data.UserGroup);
      };
      requestGroup();
    }, [])
  );

  // allGroupsOfUser.map((groups) => {
  //   console.log("mes groupes ?", groups.Name);
  // });
  


  return (
    <View style={styles.mainContainer}>
      <Image
                  style={styles.ImageLogo}
                  source= {require("../assets/logoBlanco.png")}
                  />
        <View style={styles.mainCard}>
          <View style={{ marginBottom: 16 }}>
            <Image
              style={{ width: width, height: 200, top: 40 }}
              source= {{uri: mainEventImage[mainEventImage.length-1].ImagePath}}
            />
            <View style={{ flexDirection: "column" }}>
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.infoUnderMainImage}>
                  {mainEventImage[mainEventImage.length-1].Name}
                </Text>
                <Text style={styles.infoUnderMainImage}>
                  {mainEventImage[mainEventImage.length-1].Fight}
                </Text>
                <Text style={styles.infoUnderMainImage}>
                  {mainEventImage[mainEventImage.length-3].Date}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.groupNavigate} onPress={() => navigation.navigate("CreateGroup")}>
            <Text style={styles.groupNavigateText}>Crée ton groupe !</Text>
          </TouchableOpacity>
        </View>
        {allGroupsOfUser &&(
        <ScrollView horizontal={true} style={styles.scrollViewHorizontal} >
            {allGroupsOfUser.map((group) => (
          <TouchableOpacity 
          onPress={() => navigation.navigate("MyTopTabs", group)}
          key={group.ID}
          >
          <View style={{flexDirection:"row"}}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: `${SERVEUR}/static/avatar/${group.PathOfGroupAvatar}` }} />
            <Text style={styles.card}>{group.Name}</Text>
          </View>
          </View>
          </TouchableOpacity>
            ))}
        </ScrollView>
        )}
        <View>
          <Text style={styles.textIfUserNoGroup}>test</Text>
        </View>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1, 
    backgroundColor: "black",
    alignItems:"center",
  },
  ImageLogo:{
    top:50,
    height:90,
    width:"55%",
    alignItems: "center",
  },
  mainCard:{
    padding: 0,
    marginTop: 15,
  },
  infoUnderMainImage:{
    top:45,
    fontWeight: "700",
    color:"white",
    fontSize:15,
    textAlign: "center",
    padding:3,
  },
  groupNavigate:{
    marginTop: 40,
    borderBottomColor: '#202020',
    borderBottomWidth: 2,
    // borderRadius: 10,
    width:"35%",
  },
  groupNavigateText:{
    color: "#898989",
    fontWeight: "700",
    alignItems: "center",
    textAlign: "center",
    fontSize: 15,
  },
  scrollViewHorizontal:{
    flexDirection: 'row',
  },
  imageContainer:{
    marginRight: 10,
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 8,
    top:40
  },
  card:{
    fontSize: 15,
    fontWeight: '300',
    top:105,
    textAlign:"center",
    color:"white",
    marginTop:10
  },
  textIfUserNoGroup:{
    color:'white'
  },
});
