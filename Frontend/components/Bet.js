import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { SERVEUR } from "@env";
import Fightersjson from "../allFighters.json";
import { useFocusEffect } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const Bet = ({ route, user, navigation }) => {
  const UfcSilhouetteRightStance =
  "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";
  const UfcSilhouetteLeftStance =
  "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-left-silhouette.png";
  const [matchIdOfUser, setMatchIdOfUser] = useState([]);
  const [matchIdOfEventByDate, setMatchIdOfEventByDate] = useState(null);
  const [fightersName, setFightersName] = useState([]);
  const [allMatchIdOfEventByDate, setAllMatchIdOfEventByDate] = useState([]);
  const groupId = route.params.ID;
  const userId = user.user.ID;

  // Fonction pour supprimer les accents
  const strNoAccent = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Fonction pour obtenir la date du prochain samedi
  const getNextSaturdayDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = 6 - dayOfWeek;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + diff);
    return nextSaturday.toISOString().slice(0, 10);
  };

  const nextSaturdayDate = getNextSaturdayDate();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // Requête pour obtenir les paris de l'utilisateur pour le groupe cette semaine
          const response = await fetch(
            `${SERVEUR}/bet/betOfUserByGroupOfThisWeek/${groupId}/${userId}/`
          );
          const json = await response.json();
          const matchIdOfUser = json.message.map((id) => id.MatchID);
          setMatchIdOfUser(matchIdOfUser);

          // Requête pour obtenir les matchs de la semaine
          const matchResponse = await fetch(
            `${SERVEUR}/matchsofthewe/whithoutFilter`
          );
          const matchJson = await matchResponse.json();
          setAllMatchIdOfEventByDate([...matchJson.matches]);

          const matchIdOfEventByDate = matchJson.matches.map((sportEvent) => {
            const obj = {};
            obj["sportEventID"] = sportEvent.sport_event.id;
            obj["sportEventCombatant1"] = strNoAccent(
              sportEvent.sport_event.competitors[0].name
            );
            obj["sportEventCombatant2"] = strNoAccent(
              sportEvent.sport_event.competitors[1].name
            );
            return obj;
          });
          setMatchIdOfEventByDate([...matchIdOfEventByDate]);

          // Mettez à jour les noms des combattants une fois que les données sont disponibles
          if (matchIdOfUser.length > 0 && matchIdOfEventByDate.length > 0) {
            const fightersNameArray = matchIdOfEventByDate.filter((match) =>
              matchIdOfUser.includes(match.sportEventID)
            );
            setFightersName(fightersNameArray);
          }
        } catch (error) {
          console.log("Error message", error);
        }
      };

      fetchData();

      // Nettoyer l'état lors du démontage
      return () => {
        setFightersName([]);
      };
    }, [groupId, userId])
  );

  return (
    <ScrollView style={styles.container}>
      {fightersName?.map((el, idx) => {
        const nameOfFirstFighter = el.sportEventCombatant1
          .split(",")
          .reverse()
          .join(" ");
        const nameOfsecondFighter = el.sportEventCombatant2
          .split(",")
          .reverse()
          .join(" ");
        const indexOfFirstFigther = Fightersjson.map(
          (fighter) => fighter.nom_combattant
        ).indexOf(nameOfFirstFighter.trim());
        const indexOfSecondFigther = Fightersjson.map(
          (fighter) => fighter.nom_combattant
        ).indexOf(nameOfsecondFighter.trim());

        return (
          <TouchableOpacity
            key={idx}
            style={styles.matchBox}
            onPress={() => navigation.navigate("CreateBet", groupId)}
          >
            <View>
              <Image
                style={styles.Image}
                source={{
                  uri:
                    indexOfFirstFigther !== -1
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
                    indexOfSecondFigther !== -1
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

export default Bet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    backgroundColor: "#8FCE00",
    padding: 5,
    marginBottom: 30,
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 21,
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