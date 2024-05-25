import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateRoomScreen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tematica, setTematica] = useState('');
  const [edadMinima, setEdadMinima] = useState('');
  const [edadMaxima, setEdadMaxima] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [numeroParticipantes, setNumeroParticipantes] = useState('');
  const [fecha, setFecha] = useState(''); // Nuevo estado para la fecha
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [id, setId] = useState(0);
  const [idNavigationJuegos, setIdNavigationJuegos] = useState(0); // Usar estado en lugar de variable local

  useEffect(() => {
    loadUserData(); // Cargar los datos del usuario cuando el componente se monta
  }, []);

  const handleVerJuegos = () => {
    console.log("el id que voy a pasar eso el siguiente: " + idNavigationJuegos);
    navigation.navigate('VerJuegos', { idNavigationJuegos }); // Pasar el ID como un objeto
  };

  const handleCreateRoom = async () => {
    try {
      const response = await fetch('http://192.168.1.90:3000/salas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          tematicaSala: tematica,
          edadMinima: parseInt(edadMinima),
          edadMaxima: parseInt(edadMaxima),
          localizacionSala: localizacion,
          numeroParticipantes: parseInt(numeroParticipantes),
          fecha: fecha, // Agregar la fecha al cuerpo de la solicitud
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sala');
      }

      const data = await response.json(); // Obtener el cuerpo de la respuesta
      setIdNavigationJuegos(data); // Asignar el ID al estado


      setNombre('');
      setDescripcion('');
      setTematica('');
      setEdadMinima('');
      setEdadMaxima('');
      setLocalizacion('');
      setNumeroParticipantes('');
      setFecha(''); // Limpiar el estado de la fecha

    } catch (error) {
      console.error('Error al crear la sala:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setId(id);
        console.log("El ID del usuario es " + id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  useEffect(() => {
    if (idNavigationJuegos !== 0) {
      handleJoinParty(); // Llamar a handleJoinParty cuando idNavigationJuegos se haya actualizado
    }
  }, [idNavigationJuegos]);

  const handleJoinParty = async () => {
    try {
      loadUserData();
      console.log("Me he unido a la sala " + idNavigationJuegos + " y soy el usuario con ID " + id);
      const response = await fetch(`http://192.168.1.90:3000/salas/${idNavigationJuegos}/usuarios/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        handleVerJuegos();
      } else {
        throw new Error('Error al unirse a la fiesta');
      }
    } catch (error) {
      console.error('Error al unirse a la fiesta:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Sala</Text>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />
      <TextInput
        placeholder="Temática"
        value={tematica}
        onChangeText={setTematica}
        style={styles.input}
      />
      <TextInput
        placeholder="Edad Mínima"
        value={edadMinima}
        onChangeText={setEdadMinima}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Edad Máxima"
        value={edadMaxima}
        onChangeText={setEdadMaxima}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Localización"
        value={localizacion}
        onChangeText={setLocalizacion}
        style={styles.input}
      />
      <TextInput
        placeholder="Número de Participantes"
        value={numeroParticipantes}
        onChangeText={setNumeroParticipantes}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />
      <Button title="Confirmar Ajustes" onPress={handleCreateRoom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
});

export default CreateRoomScreen;
