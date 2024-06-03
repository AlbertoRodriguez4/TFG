import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const PlanBusiness = () => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpDate, setCardExpDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setId(id);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  };

  const handleCardPayment = () => {
    setSelectedPaymentMethod('card');
  };

  const handlePaypalPayment = () => {
    setSelectedPaymentMethod('paypal');
  };

  const handlePayment = async () => {
    setLoading(true);
    if (selectedPaymentMethod === 'card') {
      await makeCardPayment();
    } else if (selectedPaymentMethod === 'paypal') {
      await makePaypalPayment();
    }
    setLoading(false);
  };

  const makeCardPayment = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'Business',
        }),
      });
      const paymentData = await response.json();
      Alert.alert('Pago realizado correctamente');
    } catch (error) {
      console.error('Error al realizar el pago con tarjeta de crédito:', error);
    }
  };

  const makePaypalPayment = async () => {
    try {
      const response = await fetch(`http://192.168.1.90:3000/usuarios/${id}/plan`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'Business',
        }),
      });
      const paymentData = await response.json();
      Alert.alert('Pago realizado correctamente');
    } catch (error) {
      console.error('Error al realizar el pago con PayPal:', error);
    }
  };

  let paymentForm = null;
  if (selectedPaymentMethod === 'card') {
    paymentForm = (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Número de tarjeta"
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          value={cardName}
          onChangeText={setCardName}
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de expiración (MM/YY)"
          value={cardExpDate}
          onChangeText={setCardExpDate}
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cardCvv}
          onChangeText={setCardCvv}
          placeholderTextColor="#ffffff"
        />
      </View>
    );
  } else if (selectedPaymentMethod === 'paypal') {
    paymentForm = (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={paypalEmail}
          onChangeText={setPaypalEmail}
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={paypalPassword}
          onChangeText={setPaypalPassword}
          placeholderTextColor="#ffffff"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <Text style={styles.title}>Plan <Text style={styles.titleBold}>Business</Text></Text>
        </View>

        <LinearGradient
          colors={['#FFDE59', '#FF914D']}
          style={styles.bottomSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image source={require('../assets/mono-business.jpg')} style={styles.image} />

          <View style={styles.whiteContainer}>
            <Text style={styles.subtitleBlack}>¿Qué es Party Wars Business?</Text>
            <Text style={styles.descriptionBlack}>
              Party Wars Business permite a las empresas crear eventos exclusivos, con actividades que únicamente se pueden jugar en estos tipos de eventos.
            </Text>
            </View>

            <View style={styles.whiteContainer}>

            <Text style={styles.subtitleBlack}>¿Por qué elegir el Plan Business?</Text>
            <Text style={styles.descriptionBlack}>
              Preferencia a la hora de aparecer en búsquedas y en el menú principal, crear el evento con antelación, publicidad dentro de la aplicación, ¡y muchas cosas más!
            </Text>
          </View>

          <View style={styles.paymentMethods}>
            <TouchableOpacity style={styles.paymentButton} onPress={handleCardPayment}>
              <Text style={styles.paymentButtonText}>Tarjeta de Crédito</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentButton} onPress={handlePaypalPayment}>
              <Text style={styles.paymentButtonText}>PayPal</Text>
            </TouchableOpacity>
          </View>
          {paymentForm}

          <TouchableOpacity style={styles.planButton} onPress={handlePayment}>
            <Text style={styles.planButtonText}>Plan Business 💼 45€</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
    width: 350,
    height: 150,
    marginVertical: 10,
    borderRadius: 15,
    top: -100,
    position: 'absolute',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitleBlack: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionBlack: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  whiteContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  paymentButton: {
    flex: 1,
    backgroundColor: '#313131',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 17,
  },
  planButton: {
    backgroundColor: '#313131',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  planButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlanBusiness;