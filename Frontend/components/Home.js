import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
  Dimensions,
} from "react-native";
import mainEventImage from '../assets/mainEvents.json';

const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Home = () => {
  const data = [
    {
      imageSource: require("../assets/combatCategorie1.jpeg"),
      text: "MOICANO VS DOBER",
    },
    {
      imageSource: require("../assets/combatCat5.webp"),
      text: "ARAUJO VS SILVA",
    },
    {
      imageSource: require("../assets/combatCat1.jpeg"),
      text: "BROWN VS SALIKHOV",
    },
    {
      imageSource: require("../assets/combatCat2.jpeg"),
      text: "KHIZRIEV VS MURADOV",
    },
    {
      imageSource: require("../assets/combatCat4.jpeg"),
      text: "URBINA VS RADTKE",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View style={{ padding: 0,marginTop: 8 }}>
          <View style={{ marginBottom: 16 }}>
            <Image
              style={{ width: width, height: 200, top: 40 }}
              source= {{uri: mainEventImage[mainEventImage.length-1].ImagePath}}
            />
            <View style={{ flexDirection: "column" }}>
              <View style={{ marginLeft: 16 }}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    top: 50,
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  {mainEventImage[mainEventImage.length-1].Name}
                </Text>
                <Text style={{ top: 60, textAlign: "center", color: "black" }}>
                  {mainEventImage[mainEventImage.length-1].Fight}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  top: 100,
                  textAlign: "left",
                  color: "black",
                }}
              >
                Catégorie 1
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  top: 105,
                  textAlign: "right",
                  color: "black",
                }}
              >
                Voir plus
              </Text>
            </View>

            <ScrollView horizontal={true} style={styles.scrollView}>
              <View style={{ flexDirection: "row" }}>
                {data.map((item, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image style={styles.image} source={item.imageSource} />
                    <Text style={styles.card}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={{ marginBottom: 16 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  top: 100,
                  textAlign: "left",
                  color: "black",
                }}
              >
                Catégorie 2
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "300",
                  top: 105,
                  textAlign: "right",
                  color: "black",
                }}
              >
                Voir plus
              </Text>
            </View>
            <ScrollView horizontal={true} style={styles.scrollView}>
              <View style={{ flexDirection: "row" }}>
                {data.map((item, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image style={styles.image} source={item.imageSource} />
                    <Text style={styles.card}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
    paddingBottom: 110,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    top: 110,
  },
  card: {
    fontSize: 15,
    fontWeight: "300",
    top: 105,
    textAlign: "center",
    color: "white",
    marginTop: 10,
    fontWeight: "bold",
  },
});
