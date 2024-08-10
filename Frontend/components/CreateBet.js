import React, { useState } from "react";
import { IP } from "@env";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
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
      <Text style={styles.firstBoxOfBet}>Winner Du Match</Text>
      <View style={styles.winners}>
        <View
          style={
            winner === firstFigther ? styles.winnerButton : styles.normalButton
          }
        >
          <Button
            title={firstFigther}
            color={winner === firstFigther ? "#ffffff" : "#ffffff"}
            onPress={() => setWinner(firstFigther)}
          />
        </View>
        <View
          style={
            winner === secondFigther ? styles.winnerButton : styles.normalButton
          }
        >
          <Button
            title={secondFigther}
            color={winner === secondFigther ? "#ffffff" : "#ffffff"}
            onPress={() => setWinner(secondFigther)}
          />
        </View>
      </View>
      {winner && (
        <>
          <Text style={styles.titleTypeWin}>{winner} gagnant par: </Text>
          <View>
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
                    const apiUrl = `http://${IP}:3001/bet/${userId}/${groupID}/${sportEventId}`;
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
  );
};

export default CreateBet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
    borderTopColor: "red",
    borderTopWidth: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 25,
    color: "white",
  },
  victoryTypes: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 15,
  },
  koTko: {
    marginRight: 15,
  },
  koTkoTitle: {
    color: "white",
  },
  submission: {
    color: "white",
  },
  points: {
    color: "white",
  },
  firstBoxOfBet: {
    fontSize: 16,
    marginBottom: 12,
    color: "white",
  },
  winners: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  normalButton: {
    flexDirection: "row",
    color: "white",
    backgroundColor: "red",
    marginLeft: 15,
    borderRadius: 25,
  },
  winnerButton: {
    flexDirection: "row",
    color: "white",
    backgroundColor: "#bb0b0b",
    borderColor: "#FF6600",
    borderWidth: 3,
    marginLeft: 15,
    borderRadius: 25,
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
