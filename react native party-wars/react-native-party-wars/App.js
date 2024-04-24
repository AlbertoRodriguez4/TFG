import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import Login from './src/screens/Login';
export default function App() {
  return (

    <NavigationContainer>
      {/*1º) <NavigationStacks /> */}
      <Login />
    </NavigationContainer>
  );
      
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

