import React from "react";
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

const Home = ( {navigation} ) => {
  return (
    <View style={styles.mainContainer}>
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
        <TouchableOpacity 
        style={styles.groupNavigate}
        onPress={() => navigation.navigate("CreateGroup")}>
          <Text style={styles.groupNavigateText}>Crée ton groupe !</Text>
        </TouchableOpacity>
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
  mainCard:{
    padding: 0,
    marginTop: 8
  },
  infoUnderMainImage:{
    top:45,
    fontWeight: "700",
    color:"white",
    fontSize:15,
    textAlign: "center",
  },
  groupNavigate:{
    top: 40,
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width:"35%",
  },
  groupNavigateText:{
    fontWeight: "700",
    textAlign:"center",
    color:"white",
  },
});
