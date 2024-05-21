import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();

  // Utiliza los estados locales para almacenar los datos del usuario
  const [nome, setnome] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [plan, setPlan] = useState(''); 
  const [descripcionPersonal, setdescripcionPersonal] = useState(''); 
  const [id, setId] = useState(0); // Establece el estado del ID

  useEffect(() => {
    // Cargar los datos del usuario al cargar la pantalla
    loadUserData();
    console.log(id)
  }, []);

  const loadUserData = async () => {
    try {
      // Obtener los datos del usuario guardados en AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        // Si hay datos del usuario, actualizar los estados locales
        const { id, nome, email, password, plan, descripcionPersonal } = JSON.parse(userData);
        setId(id); // Establece el estado del ID
        setnome(nome);
        setEmail(email);
        setPassword(password);
        setPlan(plan);
        setdescripcionPersonal(descripcionPersonal);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUserData = {
        nome: nome,
        email: email,
        password: password,
        plan: plan,
        descripcionPersonal: descripcionPersonal,
      };

      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}`, { // Utiliza el ID para construir la URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      // Una vez actualizados los datos, puedes redirigir al usuario a una pantalla de confirmación o a otra pantalla
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar el usuario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Editar Perfil</Text>
      <TextInput
        placeholder="Nombre"
        value={nome}
        onChangeText={setnome}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
     
      <TextInput
        placeholder="Descripción personal"
        value={descripcionPersonal}
        onChangeText={setdescripcionPersonal}
        style={styles.input}
      />
      <Button title="Actualizar Perfil" onPress={handleUpdateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: 250,
  },
});

export default EditProfileScreen;



