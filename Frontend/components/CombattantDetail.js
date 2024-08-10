import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Detail = ({ route }) => {
  const { item } = route.params;
  const defaultImage = "/themes/custom/ufc/assets/img/no-profile-image.png";
  const UfcSilhouetteRightStance = "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";

  return (
    <View style={styles.card}>
      {item.image_path && item.image_path !== defaultImage ? (
        <Image
          source={{ uri: item.image_path }}
          style={styles.imageBackground}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={{ uri: UfcSilhouetteRightStance }}
          style={styles.imageBackground}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{item.nom_combattant}</Text>
      {item.category && (
        <>
          <Text style={styles.info}>Catégorie: {item.category}</Text>
        </>
      )}
      {item.wld && (
        <>
          <Text style={styles.info}>Victoire/Égalité/Défaite:</Text>
          <Text style={styles.info}>{item.wld}</Text>
        </>
      )}
      {item.age && (
        <>
          <Text style={styles.info}>Âge:</Text>
          <Text style={styles.info}>{item.age}</Text>
        </>
      )}
      {item.method_win_ko && (
        <>
          <Text style={styles.info}>Pourcentage de KO:</Text>
          <Text style={styles.info}>{item.method_win_ko}</Text>
        </>
      )}
      {item.method_win_dec && (
        <>
          <Text style={styles.info}>Pourcentage de victoire aux points:</Text>
          <Text style={styles.info}>{item.method_win_dec}</Text>
        </>
      )}
      {item.method_win_sub && (
        <>
          <Text style={styles.info}>Pourcentage de soumission:</Text>
          <Text style={styles.info}>{item.method_win_sub}</Text>
        </>
      )}
      {item.status && (
        <>
          <Text style={styles.info}>Status:</Text>
          <Text style={styles.info}>{item.status}</Text>
        </>
      )}
      {item.pob && (
        <>
          <Text style={styles.info}>Lieu de naissance:</Text>
          <Text style={styles.info}>{item.pob}</Text>
        </>
      )}
      {item.fight_style && (
        <>
          <Text style={styles.info}>Style de combat:</Text>
          <Text style={styles.info}>{item.fight_style}</Text>
        </>
      )}
      {item.weight && (
        <>
          <Text style={styles.info}>Poids:</Text>
          <Text style={styles.info}>{item.weight}</Text>
        </>
      )}
    </View>
  );
};
const toto = [{ tup: "de" }, { tup: "de" }, { tup: "de" }];
export default Detail;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    flexDirection: "column",
    
    // justifyContent: "center",
    alignItems: "center",
    height:"100%",
  },
  title: {
    textAlign: "center",
    color: "black",
    marginTop: 50,
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
    marginTop:100,
    width: 200,
    height: 200,
    justifyContent: 'flex-start', // Assure que le contenu est aligné en haut
  },
  info: {
    textAlign: "center",
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
});
