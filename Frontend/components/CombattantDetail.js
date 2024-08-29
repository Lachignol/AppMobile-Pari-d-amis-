import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

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
    <View style={styles.card}>
      {item.image_path &&
      item.image_path !== defaultImage &&
      item.image_path !== defaultImageW ? (
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
        />
      ) : (
        <Image
          source={{ uri: UfcSilhouetteRightStance }}
          style={styles.imageBackgroundDefault}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{item.nom_combattant}</Text>
      <View style={styles.infoTitleMain}>
      {item.category && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Catégorie:</Text>
         
          <View style={styles.info}>
            <Text style={styles.infoText}> {item.category}</Text>
          </View>
          </View>
        </>
      )}
      {item.wld && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Victoire/Égalité/Défaite:</Text>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.wld}</Text>
          </View>
          </View>
        </>
      )}
      {item.age && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Âge:</Text>
        
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.age}</Text>
          </View>
          </View>
        </>
      )}
      {item.method_win_ko && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Pourcentage de KO:</Text>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.method_win_ko}</Text>
          </View>
          </View>
        </>
      )}
      {item.method_win_dec && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>
              Pourcentage de victoire aux points:
            </Text>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.method_win_dec}</Text>
          </View>
          </View>
        </>
      )}
      {item.method_win_sub && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Pourcentage de soumission:</Text>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.method_win_sub}</Text>
          </View>
          </View>
        </>
      )}
      {item.status && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Status:</Text>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.status}</Text>
          </View>
          </View>
        </>
      )}
      {item.pob && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Lieu de naissance:</Text>
          
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.pob}</Text>
          </View>
          </View>
        </>
      )}
      {item.fight_style && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Style de combat:</Text>
         
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.fight_style}</Text>
          </View>
          </View>
        </>
      )}
      {item.weight && (
        <>
          <View style={styles.infoTitleBoxe}>
            <Text style={styles.infoTitleText}>Poids:</Text>
         
          <View style={styles.info}>
            <Text style={styles.infoText}>{item.weight}</Text>
          </View>
          </View>
        </>
      )}
      </View>
    </View>
  );
};
export default Detail;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "black",
    // backgroundColor: "white",
    flexDirection: "column",

    // justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
    marginTop: 80,
    width: 200,
    height: 200,
    justifyContent: "flex-start", // Assure que le contenu est aligné en haut
  },
  imageBackgroundDefault: {
    marginTop: 80,
    width: 200,
    height: 200,
    justifyContent: "flex-start", // Assure que le contenu est aligné en haut
    shadowColor: "white",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  infoTitleMain: {
    margin: 1,
    borderRadius: 10,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fa580a",
  },
  infoTitleBoxe: {
    margin: 1,
    borderRadius: 10,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    
  },
  infoTitleText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    shadowRadius:4,
    shadowOpacity:0.4,
    shadowColor:"#fa580a",
  },
  info: {
    borderRadius: 8,
    marginBottom: 1,
    padding: 2,
    color: "white",
  },
  infoText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    
  },
});
