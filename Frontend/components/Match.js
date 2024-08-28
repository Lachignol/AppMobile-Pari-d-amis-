import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SERVEUR, APIKEY } from '@env';
import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Dimensions } from "react-native";
import Fightersjson from "../allFighters.json";
import _ from "lodash";

const windowWidth = Dimensions.get("window").width;

const Match = ({ route, navigation, user }) => {
  const [matchs, setMatchs] = useState(null);
  const [filteredMatchs, setFilteredMatchs] = useState([]);
  const [betOfUserByMatchId, setBetOfUserByMatchId] = useState([]);

  const userId = user.user.ID
  const UfcSilhouetteRightStance =
    "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";
  const UfcSilhouetteLeftStance =
    "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-left-silhouette.png";
  const groupID = route.params.ID;

  useFocusEffect(
    React.useCallback(() => {
      fetch(`${SERVEUR}/matchsofthewe/${groupID}/${userId}`,{
  
      }).then(response => response.json())
      .then(json => setFilteredMatchs(json.matches))
    },[]
  ))

  console.log("mes match ?", filteredMatchs);
   
  function strNoAccent(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/-/g, " ");
  }
  return (
    <ScrollView style={styles.container}>
      {filteredMatchs?.map((match, idx) => {
        const nameOfFirstFighter = match.sport_event.competitors[0].name
          .split(",")
          .reverse()
          .join(" ");
        const nameOfsecondFighter = match.sport_event.competitors[1].name
          .split(",")
          .reverse()
          .join(" ");
        // console.log(
        //   "first",
        //   strNoAccent(nameOfFirstFighter.trim()),
        //   "second",
        //   strNoAccent(nameOfsecondFighter.trim())
        // );
        const indexOfFirstFigther = Fightersjson.map((fighter) =>
          strNoAccent(fighter.nom_combattant)
        ).indexOf(strNoAccent(nameOfFirstFighter.trim()));
        const indexOfSecondFigther = Fightersjson.map((fighter) =>
          strNoAccent(fighter.nom_combattant)
        ).indexOf(strNoAccent(nameOfsecondFighter.trim()));
        // console.log("mmm", indexOfFirstFigther, indexOfSecondFigther);
        return (
          <TouchableOpacity
            key={idx}
            style={styles.matchBox}
            onPress={() =>
              navigation.navigate("CreateBet", {
                groupID: groupID,
                matchInfo: match,
              })
            }
          >
            <View>
              <Image
                style={styles.Image}
                source={{
                  uri:
                    indexOfFirstFigther !== -1 && Fightersjson[indexOfFirstFigther].image_path != ""
                      ? Fightersjson[indexOfFirstFigther].image_path
                      : UfcSilhouetteRightStance,
                }}
              />
            </View>
            <View style={styles.infosBox}>
              <Text>{nameOfFirstFighter}</Text>
              <Text>VS</Text>
              <Text>{nameOfsecondFighter}</Text>
            </View>
            <View>
              <Image
                style={styles.Image}
                source={{
                  uri:
                    indexOfSecondFigther !== -1 && Fightersjson[indexOfSecondFigther].image_path != ""
                      ? Fightersjson[indexOfSecondFigther].image_path
                      : UfcSilhouetteLeftStance,
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Match;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    width: windowWidth,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  matchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 150,
    backgroundColor: "red",
    padding: 5,
    marginBottom: 30,
    borderRadius: 20,
  },
  infosBox: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  Image: {
    width: 90,
    height: 90,
    objectFit: "contain",
  },
});
