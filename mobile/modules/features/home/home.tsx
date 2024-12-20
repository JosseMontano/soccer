import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
} from "../../core/constant/color";
import { Header } from "./components/header";
import { useEffect, useState } from "react";
import useFetch from "../../core/hooks/useFetch";
import { ModalComp } from "../../core/components/modal";
import { Game, TournamentFixture } from "./api/responses";
import { ExtraInfo } from "./components/extraInfo";
import Icon from 'react-native-vector-icons/AntDesign';
import { channel } from "../../core/libs/pusher";
import DateTimePicker from "@react-native-community/datetimepicker";
//caretdown caretup
type AccordionState = {
  isCollapsed: boolean;
  animatedHeight: Animated.Value;
};

export const Home = () => {
  const { fetchData, postData } = useFetch();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { data } = fetchData(
    `GET /tournaments/tournamentsPublic?date=${selectedDate.toISOString().split("T")[0]}` as any
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<"firstTeam" | "secondTeam">(
    "firstTeam"
  );

  const [tournament, setTournament] = useState<TournamentFixture[]>([]);

  useEffect(() => {
    if (data) {
      setTournament(data);
    }
  }, [data]);

  useEffect(() => {
    const eventName = "new-goal";
    channel.bind(
      eventName,
      (res: {
        tournamentId: string;
        gameId: string;
        team: "firstTeam" | "secondTeam";
        action: "increment" | "decrement";
        newGoals: number;
      }) => {
        setTournament((prev) => {
          return prev.map((t) => {
            if (t.id === res.tournamentId) {
              return {
                ...t,
                games: t.games.map((g) => {
                  if (g.id === res.gameId) {
                    return {
                      ...g,
                      goalsFirstTeam:
                        res.team === "firstTeam"
                          ? res.newGoals
                          : g.goalsFirstTeam,
                      goalsSecondTeam:
                        res.team === "secondTeam"
                          ? res.newGoals
                          : g.goalsSecondTeam,
                    };
                  }
                  return g;
                }),
              };
            }
            return t;
          });
        });
      }
    );
  }, []);
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleDatePicker = () => setShowDatePicker((prev) => !prev);

  const postMutation = postData("POST /games/events/prediction");
  const [prediction, setPrediction] = useState("");
  const onSubmit = async (
    amountVictoriesTeam1: number,
    amountVictoriesTeam2: number
  ) => {
    const form = {
      amountVictoriesTeam1,
      amountVictoriesTeam2,
    };
    await postMutation(
      {
        ...form,
      },
      {
        onSuccess: (res) => {
          setPrediction(res.data);
        },
      }
    );
  };

  const [gameSelected, setGameSelected] = useState<Game>({} as Game);
  const selectTeam = async (v: Game, team: "firstTeam" | "secondTeam") => {
    setIsOpen(true);
    setSelectedTeam(team);
    setGameSelected(v);
    await onSubmit(v.firstTeam.amountVictories, v.secondTeam.amountVictories);
  };

  const [accordions, setAccordions] = useState<Record<string, AccordionState>>(
    {}
  );

  const toggleCollapse = (id: string) => {
    setAccordions((prev) => ({
      ...prev,
      [id]: {
        isCollapsed: !prev[id]?.isCollapsed,
        animatedHeight: prev[id]?.animatedHeight || new Animated.Value(0),
      },
    }));

    const { isCollapsed, animatedHeight } = accordions[id] || {
      isCollapsed: true,
      animatedHeight: new Animated.Value(0),
    };

    Animated.timing(animatedHeight, {
      toValue: isCollapsed ? 150 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const truncateText = (text: string) => {
    return text.length > 4 ? text.slice(0, 5) + "..." : text;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: secondaryColor }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.containerHeader}>
          <Text style={styles.title}>Torneos</Text>
          <TouchableOpacity onPress={toggleDatePicker} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {selectedDate.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"} 
            onChange={handleDateChange}
          />
        )}  
        <View style={styles.containerHeader}>
          <Text style={styles.title}>Torneos</Text>
          <Text style={styles.title}>22-10-14</Text>
        </View>

        {tournament?.map((v) => {
          const { isCollapsed = true, animatedHeight = new Animated.Value(0) } =
            accordions[v.id] || {};
          return (
            <View style={styles.containerTable} key={v.id}>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{v.name}</Text>
                <TouchableOpacity onPress={() => toggleCollapse(v.id)}>
                  <Text style={styles.collapseText}>
                    {/*@ts-ignore  */}
                    {isCollapsed ? <Icon name="caretdown" size={15}/> :  <Icon name="caretup" size={15}/>}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Animated Collapsible Section */}
              <Animated.View style={[styles.table, { height: animatedHeight }]}>
                <Text style={styles.titleTable}>Partidos</Text>
                {v.games.map((game) => (
                  <View key={game.id} style={styles.gameRow}>
                    <Image
                      style={styles.logoTeam}
                      source={{ uri: game.firstTeam.logo }}
                    />
                    <Text
                      style={styles.gameText}
                      onPress={() => {
                        selectTeam(game, "firstTeam");
                      }}
                    >
                      {truncateText(game.firstTeam.name)}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 9,
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.gameText}>{game.goalsFirstTeam}</Text>
                      <Text
                        style={[
                          styles.gameText,
                          {
                            backgroundColor: secondaryColor,
                            padding: 6,
                            borderRadius: 50,
                          },
                        ]}
                      >
                        vs
                      </Text>
                      <Text style={styles.gameText}>
                        {game.goalsSecondTeam}
                      </Text>
                    </View>
                    <Text
                      style={styles.gameText}
                      onPress={() => selectTeam(game, "secondTeam")}
                    >
                      {truncateText(game.secondTeam.name)}
                    </Text>
                    <Image
                      style={styles.logoTeam}
                      source={{ uri: game.secondTeam.logo }}
                    />
                  </View>
                ))}
              </Animated.View>
            </View>
          );
        })}

        {gameSelected.id && (
           <ModalComp
           setVisible={setIsOpen}
           visible={isOpen}
           title="Informacion del equipo"
           children={
             <ExtraInfo
               gameSelected={gameSelected[selectedTeam]}
               onSubmit={onSubmit}
               prediction={prediction}
               setPrediction={setPrediction}
               clubId={gameSelected[selectedTeam].id}
               tournamentId={gameSelected.tournamentId}
             />
           }
         /> 
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondaryColor,
    gap: 10,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  title: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 18,
  },
  dateButton: {
    padding: 8,
    backgroundColor: tertiaryColor,
    borderRadius: 6,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  collapseText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: "500",
  },
  containerTable: {
    backgroundColor: tertiaryColor,
    marginHorizontal: 12,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical:5,
    flexDirection: "column",
    gap: 10,
    height: "auto",
  },
  table: {
    overflow: "hidden", // Ensures the content hides during animation
    backgroundColor: tertiaryColor,
  },
  infoContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center"
  },
  titleTable: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  gameRow: {
    flexDirection: "row",
    gap: 25,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(155, 155, 155,.3)",
  },
  logoTeam: {
    width: 22,
    height: 22,
    objectFit: "contain",
  },
  gameText: {
    color: "#fff",
    fontSize: 14,
  },
});
