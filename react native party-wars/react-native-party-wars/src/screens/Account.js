import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const EditProfileScreen = () => {
  const navigation = useNavigation();

  // Utiliza los estados locales para almacenar los datos del usuario
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('');
  const [descripcionPersonal, setDescripcionPersonal] = useState('');
  const [id, setId] = useState(0);

  useEffect(() => {
    // Cargar los datos del usuario al cargar la pantalla
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        console.log(id)
        setId(id);
        fetchUserData(id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        console.log(userData);

        // Actualizar los estados locales con los datos del usuario
        setNome(userData.nome);
        setEmail(userData.email);
        setPassword(userData.password);
        setPlan(userData.plan);
        setDescripcionPersonal(userData.descripcionPersonal);
      } else {
        throw new Error('Error al obtener los datos del usuario');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario. Por favor, intenta de nuevo.');
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
      Alert.alert('Perfil actualizado', 'Su perfil ha sido actualizado exitosamente');
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
        onChangeText={setNome}
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
        onChangeText={setDescripcionPersonal}
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
