import { useRouter } from 'expo-router';
import { Button, Text, View } from "react-native";


export default function HomeScreen() {
    const router = useRouter();

    return (
        <View>
            <Text>Connection screen</Text>
            <Button title="About" onPress={() => {router.navigate('/about')}}></Button>
            <Button title="UI" onPress={() => {router.replace('/ui/preset')}}></Button>
        </View>
    );
}