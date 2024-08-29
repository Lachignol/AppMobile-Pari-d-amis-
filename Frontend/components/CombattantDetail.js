import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Detail = ({ route }) => {
  const { item } = route.params;
  const defaultImage = "/themes/custom/ufc/assets/img/no-profile-image.png";
  const defaultImageW = "/themes/custom/ufc/assets/img/silhouette-headshot-female.png";
  const defaultImageW2="https://dmxg5wxfqgb4u.cloudfront.net/styles/teaser/s3/image/fighter_images/Shadow/UFCWomen_Headshot.png?VersionId=TTjsioDQ_5V3k4NrWogFPgp1c_aYSYdv\u0026itok=1AqXHAm7"
  const UfcSilhouetteRightStance = "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";

  return (
    <View style={styles.card}>
      {item.image_path && item.image_path !== defaultImage && item.image_path !==defaultImageW ? (
        <Image
          source={{ uri: item.image_path }}
          style={styles.imageBackground}
          resizeMode="contain"
        />
      ) : item.image_path == defaultImageW ? (
        <Image
          source={{ uri: defaultImageW2 }}
          style={styles.imageBackgroundDefault}
          resizeMode="contain"
        /> ):(
          <Image
          source={{ uri: UfcSilhouetteRightStance }}
          style={styles.imageBackgroundDefault}
          resizeMode="contain"
        />

      )}
      <Text style={styles.title}>{item.nom_combattant}</Text>
      {item.category && (
        <>
          <Text style={styles.infoTitle}>Catégorie:</Text>
            <Text style={styles.info}> {item.category}</Text>
        </>
      )}
      {item.wld && (
        <>
          <Text style={styles.infoTitle}>Victoire/Égalité/Défaite:</Text>
          <Text style={styles.info}>{item.wld}</Text>
        </>
      )}
      {item.age && (
        <>
          <Text style={styles.infoTitle}>Âge:</Text>
          <Text style={styles.info}>{item.age}</Text>
        </>
      )}
      {item.method_win_ko && (
        <>
          <Text style={styles.infoTitle}>Pourcentage de KO:</Text>
          <Text style={styles.info}>{item.method_win_ko}</Text>
        </>
      )}
      {item.method_win_dec && (
        <>
          <Text style={styles.infoTitle}>Pourcentage de victoire aux points:</Text>
          <Text style={styles.info}>{item.method_win_dec}</Text>
        </>
      )}
      {item.method_win_sub && (
        <>
          <Text style={styles.infoTitle}>Pourcentage de soumission:</Text>
          <Text style={styles.info}>{item.method_win_sub}</Text>
        </>
      )}
      {item.status && (
        <>
          <Text style={styles.infoTitle}>Status:</Text>
          <Text style={styles.info}>{item.status}</Text>
        </>
      )}
      {item.pob && (
        <>
          <Text style={styles.infoTitle}>Lieu de naissance:</Text>
          <Text style={styles.info}>{item.pob}</Text>
        </>
      )}
      {item.fight_style && (
        <>
          <Text style={styles.infoTitle}>Style de combat:</Text>
          <Text style={styles.info}>{item.fight_style}</Text>
        </>
      )}
      {item.weight && (
        <>
          <Text style={styles.infoTitle}>Poids:</Text>
          <Text style={styles.info}>{item.weight}</Text>
        </>
      )}
    </View>
  );
};
export default Detail;

const styles = StyleSheet.create({
  card: {
    backgroundColor:"black",
    // backgroundColor: "white",
    flexDirection: "column",
    
    // justifyContent: "center",
    alignItems: "center",
    height:"100%",
  },
  title: {
    textAlign: "center",
    color: "#fa580a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "black",
    marginTop: 50,
    fontSize: 20,
    height: "55%",
  },
  imageBackground: {
    marginTop:80,
    width: 200,
    height: 200,
    justifyContent: 'flex-start', // Assure que le contenu est aligné en haut
    // shadowColor: "white",
    // shadowOffset: { width: 3, height: 0 },
    // shadowOpacity: 20,
    // shadowRadius: 7,
    // elevation: 45,
  },
  imageBackgroundDefault: {
    marginTop:80,
    width: 200,
    height: 200,
    justifyContent: 'flex-start', // Assure que le contenu est aligné en haut
    shadowColor: "white",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  infoTitle: {
    margin:2,
    borderRadius:10,
    borderWidth: 1,
    borderColor:"black",
    backgroundColor:"#fa580a",
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  info: {
    borderRadius: 8,
    marginBottom:2,
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});
