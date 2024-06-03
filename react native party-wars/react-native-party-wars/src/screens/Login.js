import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginError, setLoginError] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      checkSession();
    }, [])
  );

  const checkSession = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      if (user) {
        setLoggedInUser(JSON.parse(user).nome);
      }
    } catch (error) {
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/login/${email}/${password}`);
      const userData = await response.json();

      if (userData.id) {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setLoggedInUser(userData.nome);
        Alert.alert('Inicio de Sesión Exitoso', `Hola, ${userData.nome}`);
        navigation.navigate('Main', { id: userData.id });
      } else {
        setLoginError(true);
        throw new Error('Correo electrónico o contraseña incorrectos');
      }
    } catch (error) {
      setLoginError(true);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setLoggedInUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loggedInUser ? (
        <>
          <Text style={styles.welcomeText}>Bienvenido, {loggedInUser}</Text>



          <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
              <LinearGradient
                colors={['#FFDE59', '#FF914D']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
              </LinearGradient>
            </TouchableOpacity>
                  </>
      ) : (
        <>
          <View style={styles.topSection}>
            <Text style={styles.title}>Iniciar <Text style={styles.titleBold}>Sesión</Text></Text>
          </View>
          <TouchableOpacity style={styles.imageContainer}>
            <Image source={require('../assets/logopw.png')} style={styles.image} />
          </TouchableOpacity>
          <LinearGradient
            colors={['#FFDE59', '#FF914D']}
            style={styles.bottomSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TextInput
              placeholder="Correo Electrónico"
              placeholderTextColor="#ffffff"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#ffffff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
              <LinearGradient
                colors={['#313131', '#313131']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </LinearGradient>
            </TouchableOpacity>
            {loginError && (
              <Text style={styles.errorText}>El correo o la contraseña es incorrecto, inténtelo de nuevo</Text>
            )}
            <Text style={styles.registerText}>
              ¿No tienes una cuenta aún?{' '}
              <Text style={styles.registerLink} onPress={handleRegister}>
                Crear cuenta
              </Text>
            </Text>
          </LinearGradient>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
    width: '100%',
    paddingVertical: 20,
  },
  imageContainer: {
    position: 'absolute',
    top: '18%',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottomSection: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 2.2,
    width: '100%',
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
    bottom: 25,
  },
  titleBold: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    borderColor: '#ffffff',
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 15,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    bottom: 30,
  },
  buttonContainer: {
    width: '80%',
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    bottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  registerText: {
    marginVertical: 10,
    bottom: 20,
  },
  registerLink: {
    color: 'blue',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    bottom: 25,
  },
});

export default LoginScreen;