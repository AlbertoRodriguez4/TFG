import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Paragraph } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateRoomScreen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tematica, setTematica] = useState('');
  const [edadMinima, setEdadMinima] = useState('');
  const [edadMaxima, setEdadMaxima] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [numeroParticipantes, setNumeroParticipantes] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const navigation = useNavigation();
  const [showPicker, setShowPicker] = useState(false);
  const [idNavigationJuegos, setIdNavigationJuegos] = useState(0);

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
          fecha, // Enviando la fecha y hora completa
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sala');
      }

      const data = await response.json();
      console.log(data);
      setIdNavigationJuegos(data);

      setNombre('');
      setDescripcion('');
      setTematica('');
      setEdadMinima('');
      setEdadMaxima('');
      setLocalizacion('');
      setNumeroParticipantes('');
      setFecha(new Date());

      navigation.navigate('VerJuegos', { idNavigationJuegos: data });
      alert('Sala creada exitosamente');
    } catch (error) {
      console.error('Error al crear la sala:', error);
    }
  };

  const onChangeFecha = (event, selectedDate) => {
    const currentDate = selectedDate || fecha;
    setShowPicker(false);
    setFecha(currentDate);
    console.log(selectedDate, currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.bannerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/izquierda.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Partida Privada</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../assets/hogar.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/mono-premium.jpeg')} style={styles.bannerImage} />
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Party Wars</Title>
              <Paragraph style={styles.cardContent}>Configuración Partida Privada</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Nombre de la sala:</Text>
            <TextInput
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Temática de la fiesta:</Text>
            <TextInput
              placeholder="Temática"
              value={tematica}
              onChangeText={setTematica}
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Descripción:</Text>
            <TextInput
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Calle:</Text>
            <TextInput
              placeholder="Localización"
              value={localizacion}
              onChangeText={setLocalizacion}
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>N° Participantes:</Text>
            <TextInput
              placeholder="Número de Participantes"
              value={numeroParticipantes}
              onChangeText={setNumeroParticipantes}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Edad mínima:</Text>
            <TextInput
              placeholder="Edad Mínima"
              value={edadMinima}
              onChangeText={setEdadMinima}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Edad máxima:</Text>
            <TextInput
              placeholder="Edad Máxima"
              value={edadMaxima}
              onChangeText={setEdadMaxima}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Fecha y Hora:</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={styles.input}>{fecha.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fecha}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onChangeFecha}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
          <Text style={styles.buttonText}>Guardar Configuración</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 0,
  },
  header: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#000000',
    paddingHorizontal: 10,
  },
  bannerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: '80%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 10,
  },
  contentContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginTop: 20,
  },
  card: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Cambia el valor de alfa (0.8) según tu preferencia
  },
  cardContent: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -140 }, { translateY: 60 }],
    zIndex: 1,
    width: '80%',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  inputRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateRoomScreen;
