import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { primaryColor } from "../../core/constant/color";
import { useNagigation } from "../../core/hooks/useNavigation";

type ParamsType = {};
export const Welcome = ({}: ParamsType) => {
  const { handleRedirect } = useNagigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.textHeader,
            { fontSize: 30, fontWeight: 500, width: 250, textAlign: "center" },
          ]}
        >
          La Cancha en tu Bolsillo
        </Text>
        <Text
          style={[
            styles.textHeader,
            { fontSize: 14, fontWeight: 400, width: 250, textAlign: "center" },
          ]}
        >
          Partidos en vivo, estadísticas detalladas y notificaciones
          instantáneas. ¡No te pierdas nada!
        </Text>
      </View>
      <Image
        style={styles.image}
        source={require("../../../assets/defaultshield.png")}
      />
      <Pressable style={styles.btn} onPress={() => handleRedirect("Home")}>
        <Text style={styles.btnText}>Continuar</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  headerContainer: {
    alignItems: "center",
    gap: 10,
  },
  textHeader: {
    color: "#fff",
  },
  image: {
    width: 250,
    height: 250,
  },
  btn:{
    backgroundColor:"#fff",
    width:300,
    flexDirection:"row",
    justifyContent:"center",
    paddingVertical:10,
    borderRadius:17,
},
  btnText:{
    color:primaryColor,
    fontWeight:"700",
    fontSize:16
}
});
