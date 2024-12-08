import { StyleSheet, Text, View, Image } from 'react-native';
import { primaryColor } from '../../../core/constant/color';
type ParamsType = {
}
export const Header = ({}:ParamsType) => {
    return (
        <View style={styles.headerContainer}>
        <View>
          <Image
            style={styles.image}
            source={require("../../../../assets/fuchibol.png")}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.textTitle}>Minuto a Minuto</Text>
            <Text style={[styles.textTitle, { fontSize: 12 }]}>
              Sigue cada jugada, gol y falta en tiempo real. ¡La emoción del
              fútbol, siempre contigo!
            </Text>
          </View>
        </View>
        <Image
          style={styles.image2}
          source={require("../../../../assets/lewan.png")}
        />
      </View>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: primaryColor,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 150,
      },
      image: {
        width: 80,
        height: 80,
      },
      titleContainer: {
        position: "absolute",
        width: 250,
        height: 150,
        flexDirection: "column",
    
        justifyContent: "center",
      },
      textTitle: {
        color: "#FFF",
        fontWeight: "500",
        paddingHorizontal: 10,
        fontSize: 25,
      }, image2: {
        width: 150,
        height: 150,
      },
});