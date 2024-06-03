import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

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
          fecha,
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
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>

          <Text style={styles.title}>Configurar <Text style={styles.titleBold}>Partida Privada</Text></Text>
        </View>
        
        <LinearGradient
          colors={['#FFDE59', '#FF914D']}
          style={styles.bottomSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
                          <Image source={require('../assets/mono-premium.jpeg')} style={styles.image} />

          <TextInput
            placeholder="Nombre de la sala"
            placeholderTextColor="#ffffff"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Temática de la fiesta"
            placeholderTextColor="#ffffff"
            value={tematica}
            onChangeText={setTematica}
            style={styles.input}
          />
          <TextInput
            placeholder="Descripción"
            placeholderTextColor="#ffffff"
            value={descripcion}
            onChangeText={setDescripcion}
            style={styles.input}
          />
          <TextInput
            placeholder="Calle"
            placeholderTextColor="#ffffff"
            value={localizacion}
            onChangeText={setLocalizacion}
            style={styles.input}
          />
          <TextInput
            placeholder="N° Participantes"
            placeholderTextColor="#ffffff"
            value={numeroParticipantes}
            onChangeText={setNumeroParticipantes}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Edad mínima"
            placeholderTextColor="#ffffff"
            value={edadMinima}
            onChangeText={setEdadMinima}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Edad máxima"
            placeholderTextColor="#ffffff"
            value={edadMaxima}
            onChangeText={setEdadMaxima}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>{fecha.toLocaleString()}</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.buttonContainer} onPress={handleCreateRoom}>
            <LinearGradient
              colors={['#313131', '#313131']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>Guardar Configuración</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313131',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSection: {
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 150,
  },

  bottomSection: {
    paddingTop: 80,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '100%',
    alignItems: 'center',
  
    paddingBottom: 120,
  },
  title: {
    fontSize: 30,
    color: '#ffffff',
    marginBottom: 20,
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
    top : -100,
    position: 'absolute',
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
    fontSize: 17
  },
  dateInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  dateText: {
    color: '#ffffff',
    fontWeight: 'bold',

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
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CreateRoomScreen;