import React, { useState } from "react";
import { SERVEUR } from "@env";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

const CreateBet = ({ route, navigation, user }) => {
  const userId = user.user.ID;

  const { control, handleSubmit } = useForm();

  const { groupID, matchInfo } = route.params;

  const sportEventId = matchInfo.sport_event.id;

  const firstFigther = matchInfo.sport_event.competitors[0].name
    .split(",")
    .reverse()
    .join(" ");
  const secondFigther = matchInfo.sport_event.competitors[1].name
    .split(",")
    .reverse()
    .join(" ");

  const matchMaxRound = matchInfo.sport_event_status.scheduled_length;
  // console.log(matchMaxRound);
  

  const [winnerWithoutRounds, setWinnerWithoutRounds] = useState("");
  const [finishWithoutRounds, setFinishWithoutRounds] = useState("");
  const [winner, setWinner] = useState("");
  const [isEnabledKo, setIsEnabledKo] = useState(false);
  const [isEnabledSubmission, setIsEnabledSubmission] = useState(false);
  const [isEnabledPoints, setIsEnabledPoints] = useState(false);
  const [roundSwitches, setRoundSwitches] = useState(
    Array(matchMaxRound).fill(false)
  );

  // console.log("Selected Winner:", winnerWithoutRounds);
  // console.log("Selected Finish:", finishWithoutRounds);
  const [finishKo, setFinishKo] = useState("");
  const [finishSubmission, setFinishSubmission] = useState("");
  const [finishPoints, setFinishPoints] = useState("");
  const [roundNumber, setRoundNumber] = useState("");
  const [finishRounds, setFinishRounds] = useState(Array().fill());
  console.log(finishRounds);
  const toggleSwitchKo = () => {
    setIsEnabledKo((previousState) => {
      const newFinishKo = !previousState ? "KoTko" : "";
      setFinishKo(newFinishKo);
      setFinishSubmission("");
      setFinishPoints("");
      // console.log(newFinishKo);
      return !previousState;
    });
    setIsEnabledSubmission(false);
    setIsEnabledPoints(false);
    // setFinishKo(isEnabledKo ? "ko" : "");
    // console.log(finishKo);
  };
  const toggleSwitchSubmission = () => {
    setIsEnabledSubmission((previousState) => {
      const newFinishSubmission = !previousState ? "Submission" : "";
      setFinishSubmission(newFinishSubmission);
      setFinishKo("");
      setFinishPoints("");
      // console.log(newFinishSubmission);
      return !previousState;
    });
    setIsEnabledKo(false);
    setIsEnabledPoints(false);
    // setFinishSubmission(isEnabledSubmission ? "Submission" : "");
    // console.log(finishSubmission);
  };
  const toggleSwitchPoints = () => {
    setIsEnabledPoints((previousState) => {
      const newFinishPoints = !previousState ? "Points" : "";
      setFinishPoints(newFinishPoints);
      setFinishKo("");
      setFinishSubmission("");
      return !previousState;
    });
    setIsEnabledKo(false);
    setIsEnabledSubmission(false);
  };
  const toggleSwitchRoundNumber = (i) => {
    const updatedSwitches = [...roundSwitches];

    const updatedSwitchesWithDeselected = updatedSwitches.map(
      (switchState, index) => {
        if (index === i - 1) {
          return !switchState;
        } else {
          return false;
        }
      }
    );

    setRoundSwitches(updatedSwitchesWithDeselected);

    setRoundNumber(updatedSwitchesWithDeselected[i - 1] ? i : "");

    const updatedFinishRounds = updatedSwitchesWithDeselected.map(
      (switchState, index) => {
        return switchState ? index + 1 : "";
      }
    );

    setFinishRounds(updatedFinishRounds);
    // console.log(updatedFinishRounds);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {firstFigther} VS {secondFigther}
      </Text>
      <View style={styles.winners}>
      <Text style={styles.firstBoxOfBet}>Winner Du Match</Text>
      <View style={styles.winnerchoice}>
          <TouchableOpacity
            title={firstFigther}
            onPress={() => setWinner(firstFigther)}
          >
            <Text style={
            winner === firstFigther ? styles.winnerButton : styles.normalButton
          }>{firstFigther}</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
            title={secondFigther}
            onPress={() => setWinner(secondFigther)}
          >

          <Text  style={
            winner === secondFigther ? styles.winnerButton : styles.normalButton
          }>{secondFigther}</Text>
          </TouchableOpacity>
      
      </View>
      {winner && (
        <>
          <Text style={styles.titleTypeWin}>{winner} gagnant par: </Text>
          <View style={styles.parentVictoryType}>
            <View style={styles.victoryTypes}>
              <View style={styles.koTko}>
                <Text style={styles.koTkoTitle}>KoTko </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FF4C4C" }}
                  thumbColor={isEnabledKo ? "red" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitchKo}
                  value={isEnabledKo}
                />
              </View>
              <View>
                <Text style={styles.submission}>Soumission</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FF4C4C" }}
                  thumbColor={isEnabledSubmission ? "red" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitchSubmission}
                  value={isEnabledSubmission}
                />
              </View>
              <View>
                <Text style={styles.points}>Points</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FF4C4C" }}
                  thumbColor={isEnabledPoints ? "red" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitchPoints}
                  value={isEnabledPoints}
                />
              </View>
            </View>
            {!isEnabledPoints &&(
            <View style={styles.roundsWin}>
              {[...Array(matchMaxRound)].map((_, i) => (
                <View key={i}>
                  <Text style={styles.rounds}>Round {i + 1}</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#FF4C4C" }}
                    thumbColor={roundSwitches[i] ? "red" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitchRoundNumber(i + 1)}
                    value={roundSwitches[i]}
                  />
                </View>
              ))}
            </View>
            )
            }
            <Button
              title="Valider mon pari"
              onPress={async () => {
                const selectedWinner = winner === firstFigther ? "1" : "2";
                const selectedRounds = finishRounds
                  .filter((round) => round !== "")
                  .join(", ");
                const selectedFinish = [
                  finishKo,
                  finishSubmission,
                  finishPoints,
                ]
                  .filter((finish) => finish !== "")
                  .join(", ");
                const finish = [
                  selectedWinner,
                  selectedFinish,
                  selectedRounds,
                ].filter((value) => value !== "");
                console.log("finish :", finish);
                console.log("length", finish.length);
                if (finish.length === 3) {
                  const finishArray = finish
                    .toString()
                    .split(",")
                    .map((value) => value.trim());
                  // console.log("Mon array",finishArray);
                  const nonEmptyFinishArray = finishArray.filter(
                    (value) => value !== ""
                  );
                  // console.log(
                  //   "finishArray après le split :",
                  //   nonEmptyFinishArray.length
                  // );
                  if (nonEmptyFinishArray.length === 2) {
                    const [
                      selectedWinnerWithoutRounds,
                      selectedFinishWithoutRounds,
                    ] = nonEmptyFinishArray;
                    setWinnerWithoutRounds(selectedWinnerWithoutRounds);
                    setFinishWithoutRounds(selectedFinishWithoutRounds);
                  }
                }
                if (finish.length > 0) {
                  try {
                    const apiUrl = `${SERVEUR}/bet/${userId}/${groupID}/${sportEventId}`;
                    const res = await fetch(apiUrl, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        BetTab: finish,
                      }),
                    });
                    if (res.status === 200) {
                      Alert.alert("Pari validé avec succès");
                      navigation.navigate("Match");
                    }
                    else if (res.status === 412) {
                      Alert.alert("Désolé Pari cloturé");
                    } else {
                      Alert.alert("Erreur lors de la validation du pari");
                    }
                    console.log("finish : ", finish);
                  } catch (error) {
                    console.log(error.message);
                  }
                }
              }}
            />
          </View>
        </>
      )}
    </View>
    </View>
  );
};

export default CreateBet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width:"100%",
    backgroundColor: "black",
    borderTopColor: "red",
    borderTopWidth: 2,
  },
  title: {
    backgroundColor:"white",
    width:"90%",
    textAlign:"center",
    height:"5%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 25,
    color: "black",
  },
  winners: {
    flexDirection: "column",
    backgroundColor:"white",
    width:"100%",
    // justifyContent: "space-between",
  },
  firstBoxOfBet: {
    fontSize: 16,
    marginBottom: 12,
    color: "black",
    textAlign:"center",
  },
  winnerchoice:{
    width:"auto",
    flexDirection:"row",
    justifyContent:"center",
  },
  normalButton: {
    flexDirection: "row",
    color: "white",
    backgroundColor: "black",
    marginLeft: 15,
  },
  winnerButton: {
    flexDirection: "row",
    color: "black",
    backgroundColor: "#FEE71F",
    marginLeft: 15,
  },
  parentVictoryType:{
    width:"90%",
    height:"20%",
    backgroundColor:"blue",
  },
  victoryTypes: {
    backgroundColor:"white",
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
  },
  koTko: {
    marginRight: 15,
  },
  koTkoTitle: {
    color: "black",
  },
  submission: {
    color: "black",
  },
  points: {
    color: "black",
  },
  titleTypeWin: {
    color: "white",
  },
  roundsWin: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  rounds: {
    color: "white",
    marginLeft: 15,
  },
  hide: {
    opacity: 0,
  },
});
