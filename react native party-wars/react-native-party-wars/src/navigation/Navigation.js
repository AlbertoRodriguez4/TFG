import React, { useState } from 'react'; // Importa useState de react
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'; import Account from '../screens/Account';
import Main from '../screens/Main';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/RegisterScreen';
import CrearJuego from '../screens/CrearJuego';
import CrearSala from '../screens/CrearSala';
import VerJuegos from '../screens/VerJuegos';
import VerDatosSalas from '../screens/VeDatosSalas';
import PlanPremium from '../screens/PlanPremium';
import PlanBusiness from '../screens/PlanBusiness';
import SalasUsuarioUnido from '../screens/SalasUsuarioUnido';
import IniciarJuegos from '../screens/IniciarJuegos';

import CrearEvento from '../screens/CrearEvento';
import verDatosEventos from '../screens/verDatosEventos';
import CompraDeEntradas from '../screens/CompraDeEntradas';
const Tab = createBottomTabNavigator();

export default function Navigation() {
  const navigation = useNavigation(); // Agregado
  const [showTabs, setShowTabs] = useState(false);
  const [fabActive, setFabActive] = useState(false); // Estado para controlar el FAB

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator initialRouteName="Login" screenOptions={{
        tabBarStyle: showTabs ? {} : { display: 'none' },
        headerShown: false,
      }}>
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: 'Mi cuenta',
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Main"
          component={Main}
          options={{
            tabBarLabel: 'Principal',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            tabBarLabel: 'Iniciar Sesión',
            tabBarIcon: ({ color, size }) => (
              <Icon name="sign-in-alt" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            tabBarLabel: 'Registrarse',
            tabBarIcon: ({ color, size }) => (
              <Icon name="user-plus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="CrearSala"
          component={CrearSala}
          options={{
            tabBarLabel: 'Crear Sala',
            tabBarIcon: ({ color, size }) => (
              <Icon name="plus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="CrearJuego"
          component={CrearJuego}
          options={{
            tabBarLabel: 'Crear Juego',
          }}
        />
        <Tab.Screen
          name="VerJuegos"
          component={VerJuegos}
          options={{
            tabBarLabel: 'Ver Juegos',
            tabBarIcon: ({ color, size }) => (
              <Icon name="gamepad" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="VerDatosSalas"
          component={VerDatosSalas}
          options={{
            tabBarLabel: 'Ver Salas',
            tabBarIcon: ({ color, size }) => (
              <Icon name="gamepad" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="PlanPremium"
          component={PlanPremium}
          options={{
            tabBarLabel: 'Plan Premium',
            tabBarIcon: ({ color, size }) => (
              <Icon name="star" color={color} size={size} />
            ),
            tabBarVisible: showTabs,
          }}
        />
        <Tab.Screen
          name="PlanBusiness"
          component={PlanBusiness}
          options={{
            tabBarLabel: 'Plan Business',
            tabBarIcon: ({ color, size }) => (
              <Icon name="star" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="SalasUsuarioUnido"
          component={SalasUsuarioUnido}
          options={{
            tabBarLabel: 'Mis Salas',
            tabBarIcon: ({ color, size }) => (
              <Icon name="gamepad" color={color} size={size} />
            ),
            tabBarVisible: showTabs,
          }}
        />
        <Tab.Screen
          name="IniciarJuegos"
          component={IniciarJuegos}
          options={{
            tabBarLabel: 'Iniciar Juegos',
            tabBarIcon: ({ color, size }) => (
              <Icon name="gamepad" color={color} size={size} />
            ),
          }}
        />
       <Tab.Screen
          name="CrearEvento"
          component={CrearEvento}
          options={{
            tabBarLabel: 'Crear Evento',
            tabBarIcon: ({ color, size }) => (
              <Icon name="plus" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="verDatosEventos"
          component={verDatosEventos}
          options={{
            tabBarLabel: 'Ver Eventos',
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar-alt" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="CompraDeEntradas"
          component={CompraDeEntradas}
          options={{
            tabBarLabel: 'Comprar Entradas',
            tabBarIcon: ({ color, size }) => (
              <Icon name="ticket-alt" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* FAB para navegación */}
      <View style={styles.fab}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setFabActive(!fabActive)}
        >
          {/* Cambiamos el ícono por una imagen */}
          <Image
            source={require('../assets/logopw.png')} // Reemplaza con la ruta a tu imagen
            style={styles.fabImage}
          />
        </TouchableOpacity>
      </View>

      {fabActive && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayTouchable} onPress={() => setFabActive(false)}>
            <View style={styles.overlayBackground} />
          </TouchableOpacity>
          <View style={styles.fabOptions}>
            <TouchableOpacity
              style={styles.fabButton1}
              onPress={() => {
                setFabActive(false);
                navigation.navigate('Account');
              }}
            >
              <Icon name="user" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fabButton2}
              onPress={() => {
                setFabActive(false);
                navigation.navigate('Main');
              }}
            >

              <Icon name="home" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fabButton3}
              onPress={() => {
                setFabActive(false);
                navigation.navigate('CrearSala');
              }}
            >
              <Icon name="crown" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fabButton4}
              onPress={() => {
                setFabActive(false);
                navigation.navigate('SalasUsuarioUnido');
              }}
            >
              <Icon name="gamepad" size={25} color="#fff" />
            </TouchableOpacity>



            <TouchableOpacity
              style={styles.fabButton5}
              onPress={() => {
                setFabActive(false);
                navigation.navigate('PlanPremium');
              }}
            >
              <Icon name="heart" size={25} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fabButton6}
              onPress={() => {
                setFabActive(false);
                navigation.navigate('PlanBusiness');
              }}
            >
              <Icon name="star" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  invisible: {},
  fabOptions: {
    position: 'absolute', 
    bottom: 80,
    left: 0,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fab: {
    marginRight: 0,
    borderRadius: 25,
    bottom: 15,
    position: 'absolute', // Adjust half of the button's width to center it
    left: -10,
  },
  fabButton: {
    backgroundColor: '#313131',
    width: 70,
    height: 70,
    left: 160,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  fabImage: {
    width: 145, // Ajusta el tamaño de la imagen según sea necesario
    height: 145,
    resizeMode: 'contain', // Para asegurarte de que la imagen se ajusta bien dentro del botón
  },
  fabButton1: {
    backgroundColor: '#313131', // boton abajo izq
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    left: 80,
    top: 55,
  },
  fabButton2: {
    backgroundColor: '#313131',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    left: 60, //boton medio izq
    bottom: 10,
  },
  fabButton3: {
    backgroundColor: '#313131',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    left: 87, //boton medio der
    bottom: 10,
  },
  fabButton4: {
    backgroundColor: '#313131',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    left: 70, //boton abajo der
    top: 55,
  },
  fabButton5: {
    backgroundColor: '#313131',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    left: 10,//boton arriba der
    top: -80,
  },
  fabButton6: {
    backgroundColor: '#313131',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    left: -220,
    top: -80,
  },

  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
