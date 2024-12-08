import { StyleSheet, Text, View, Image } from 'react-native';
import { primaryColor } from '../../core/constant/color';

type ParamsType = {
}
export const Home = ({}:ParamsType) => {
    return (
        <View style={styles.container}>
            <Text>hi12</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:primaryColor
    }
});