import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Account from '../screens/Account';
import Main from '../screens/Main';
import LoginScreen from '../screens/Login'; // Importa el componente LoginScreen
import RegisterScreen from '../screens/RegisterScreen'; // Importa el componente RegisterScreen
import CrearJuego from '../screens/CrearJuego';
import CrearSala from '../screens/CrearSala';
import VerJuegos from '../screens/VerJuegos';
import VerDatosSalas from '../screens/VeDatosSalas';
import PlanPremium from '../screens/PlanPremium';
import PlanBusiness from '../screens/PlanBusiness';
import SalasUsuarioUnido from '../screens/SalasUsuarioUnido';
const Tab = createBottomTabNavigator();

export default function Navigation() {
  const [showTabs, setShowTabs] = useState(false);

  return (
    <Tab.Navigator initialRouteName="Login">
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Mi cuenta',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
          tabBarVisible: showTabs,
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
          tabBarVisible: showTabs,
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarLabel: 'Iniciar Sesión',
          toBarDisplay: 'none',
          tabBarIcon: ({ color, size }) => (
            <Icon name="sign-in-alt" color={color} size={size} />
          ),
          tabBarVisible: false,
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
          tabBarVisible: false,
          tabBarAccessibilityLabel: 'label-not-visible',
        }}
      />
      <Tab.Screen
        name="CrearSala"
        component = {CrearSala}
        options ={{
          tabBarLabel: 'Crear Sala',
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
      name = "CrearJuego"
      component = {CrearJuego}
      options = {{
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
      name = "VerDatosSalas"
      component = {VerDatosSalas}
      options = {{
        tabBarLabel: 'Ver Salas',
        tabBarIcon: ({ color, size }) => (
          <Icon name="gamepad" color={color} size={size} />
        ),
      }}
      />
      <Tab.Screen
        name="PlanPremium" // Agrega la pantalla PlanPremium
        component={PlanPremium}
        options={{
          tabBarLabel: 'Plan Premium',
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={size} /> // Puedes cambiar el icono según tus preferencias
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
          tabBarVisible: showTabs,
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
    </Tab.Navigator>
  );
}

