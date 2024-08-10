import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { IP, APIKEY } from '@env';
import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import Fightersjson from "../allFighters.json";

const windowWidth = Dimensions.get("window").width;
import { useFocusEffect } from "@react-navigation/native";
//const {width, height} = Dimensions.get('window') //detection dela dimension ecran

const Bet = ({route, user}) => {
  const [renderFlag, setRenderFlag] = useState(false);
  const UfcSilhouetteRightStance =
  "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-right-silhouette.png";
  const UfcSilhouetteLeftStance =
  "https://www.ufc.com/themes/custom/ufc/assets/img/standing-stance-left-silhouette.png";
  const [matchIdOfUser, setMatchId] = useState([]);
  const [matchIdOfEventByDate, setMatchIdOfEventByDate] = useState(null);
  const [fightersName, setFightersName] = useState([]);
  const [ allMatchIdOfEventByDate, setAllMatchIdOfEventByDate ] = useState([]);
  const groupId = route.params.ID
  const userId = user.user.ID
  

  const cleanArr = () => {
    setFightersName([])
  }


  useFocusEffect(
    React.useCallback(() => {

      const getNextSundayDate = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = 7 - dayOfWeek;
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + diff);
        return nextSunday.toISOString().slice(0, 10);
      };
      const getNextSaturdayDate = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = 6 - dayOfWeek;
        const nextSunday = new Date(today);
        nextSunday.setDate(today.getDate() + diff);
        return nextSunday.toISOString().slice(0, 10);
      };
      const nextSundayDate = getNextSundayDate();
      const nextSaturdayDate = getNextSaturdayDate();

    const getBetOfUserByGroupId  = async () => {
      try {
        const response = await fetch(
          `http://${IP}:3001/bet/betOfUserByGroupOfThisWeek/${groupId}/${userId}/`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const json = await response.json();
        const matchIdOfUser = json.message.map((id) => id.MatchID);
        setMatchId(matchIdOfUser);
      } catch (error) {
        console.log("Error message", error);
      }
    };


    function strNoAccent(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    const getIdOfMatchByEventDate = () => {
        try {
          fetch(`http://${IP}:3001/matchsofthewe/whithoutFilter`,{
          }).then(response => response.json())
          .then(json => setAllMatchIdOfEventByDate([...json.matches]))
          const matchIdOfEventByDate = allMatchIdOfEventByDate.map((sportEvent) => {
            const obj = {};
            obj["sportEventID"] = sportEvent.sport_event.id;
            obj["sportEventCombatant1"] =
              strNoAccent(sportEvent.sport_event.competitors[0].name);
            obj["sportEventCombatant2"] =
              strNoAccent(sportEvent.sport_event.competitors[1].name);
            return obj;
          });
          setMatchIdOfEventByDate([...matchIdOfEventByDate]);
          // console.log(matchIdOfEventByDate)
          setRenderFlag(true);
        } catch (error) {
          console.log("Error message", error);
        }
    };
    const getFightersNameOfBet = async () => {
      try {
        if (matchIdOfEventByDate && matchIdOfUser) {
          matchIdOfEventByDate.map((matchOfEvent, i) => {
            if (matchIdOfUser.includes(matchOfEvent["sportEventID"])) {
              setFightersName((prev) => [...prev, matchOfEvent]);
            }
          });
        }
      } catch (error) {
        console.log("Error messagee", error);
      }
    };
    getIdOfMatchByEventDate();
    getBetOfUserByGroupId();
    if (renderFlag) {
      getFightersNameOfBet();
    }
    return cleanArr;
  }, [matchIdOfUser]))




  // console.log(fightersName);
  // const handeTextClick = () => {};
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
    shadowOffset: {width: 0,height: 10,},
    shadowOpacity: 0.70,
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
