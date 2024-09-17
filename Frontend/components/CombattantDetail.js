import React from "react";
import { View, Text, Image, StyleSheet,Dimensions,ScrollView } from "react-native";
import { BlurView } from 'expo-blur';
const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Detail = ({ route }) => {
  const { item } = route.params;
  const defaultImage = "/themes/custom/ufc/assets/img/no-profile-image.png";
  const defaultImageW =
    "/themes/custom/ufc/assets/img/silhouette-headshot-female.png";
  const defaultImageW2 =
    "https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/Shadow/UFCWomen_Headshot.png?VersionId=TTjsioDQ_5V3k4NrWogFPgp1c_aYSYdv\u0026itok=1AqXHAm7";
  const UfcSilhouetteRightStance =
    "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {item.image_path &&
          item.image_path !== defaultImage &&
          item.image_path !== defaultImageW ? (
            <Image
              source={{ uri: item.image_path }}
              style={styles.imageBackground}
              resizeMode="contain"
            />
          ) : item.image_path === defaultImageW ? (
            <Image
              source={{ uri: defaultImageW2 }}
              style={styles.imageBackgroundDefault}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{ uri: UfcSilhouetteRightStance }}
              style={styles.imageBackgroundDefault}
              resizeMode="contain"
            />
          )}
          <Text style={styles.title}>{item.nom_combattant}</Text>
          <View style={styles.blurContainer}>
            <BlurView
              style={styles.infoContainer}
              intensity={50} // Ajustez l'intensité du flou
              tint="dark"
            >
              {item.category && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Catégorie</Text>
                  <Text style={styles.infoText}>{item.category}</Text>
                </View>
              )}
              {item.wld && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Victoire/Égalité/Défaite</Text>
                  <Text style={styles.infoText}>{item.wld}</Text>
                </View>
              )}
              {item.age && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Âge</Text>
                  <Text style={styles.infoText}>{item.age}</Text>
                </View>
              )}
              {item.method_win_ko && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Pourcentage de KO</Text>
                  <Text style={styles.infoText}>{item.method_win_ko}</Text>
                </View>
              )}
              {item.method_win_dec && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Pourcentage de victoire aux points</Text>
                  <Text style={styles.infoText}>{item.method_win_dec}</Text>
                </View>
              )}
              {item.method_win_sub && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Pourcentage de soumission</Text>
                  <Text style={styles.infoText}>{item.method_win_sub}</Text>
                </View>
              )}
              {item.status && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Status</Text>
                  <Text style={styles.infoText}>{item.status}</Text>
                </View>
              )}
              {item.pob && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Lieu de naissance</Text>
                  <Text style={styles.infoText}>{item.pob}</Text>
                </View>
              )}
              {item.fight_style && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Style de combat</Text>
                  <Text style={styles.infoText}>{item.fight_style}</Text>
                </View>
              )}
              {item.weight && (
                <View style={styles.infoTitleBox}>
                  <Text style={styles.infoTitleText}>Poids</Text>
                  <Text style={styles.infoText}>{item.weight}</Text>
                </View>
              )}
            </BlurView>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  export default Detail;
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#000000",
      flexDirection: "column",
      alignItems: "center",
      height: height * 1.2,
    },
    title: {
      textAlign: "center",
      color: "#D8D8D8",
      fontSize: 30,
      fontWeight: "bold",
      marginVertical: 10,
    },
    imageBackground: {
      marginTop: 90,
      width: 200,
      height: 200,
      justifyContent: "center",
    },
    imageBackgroundDefault: {
      marginTop: 90,
      width: 200,
      height: 200,
      justifyContent: "center", 
      shadowColor: "white",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 15,
    },
    blurContainer: {
      width: width * 0.9, // Ajustez la largeur si nécessaire
      borderRadius: 10,
      overflow: "hidden", // Assure que le flou ne dépasse pas les bords arrondis
    },
    infoContainer: {
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fond semi-transparent pour meilleure visibilité
      height:"auto"
    },
    infoTitleBox: {
      marginBottom: 10,
      borderRadius: 10,
      padding: 5,
      backgroundColor: '#202020', // Optionnel : ajoutez un fond semi-transparent
    },
    infoTitleText: {
      color: "#898989",
      fontSize: 20,
      textAlign: "left",
    },
    infoText: {
      color: "#D8D8D8",
      fontSize: 15,
      fontWeight: "bold",
    },
  });