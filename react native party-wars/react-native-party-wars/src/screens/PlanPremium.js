import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanPremium = () => {
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
          plan: "Premium",
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
          plan: "Premium",
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
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          value={cardName}
          onChangeText={setCardName}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de expiración (MM/YY)"
          value={cardExpDate}
          onChangeText={setCardExpDate}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cardCvv}
          onChangeText={setCardCvv}
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
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={paypalPassword}
          onChangeText={setPaypalPassword}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.bannerContainer2}>
          <TouchableOpacity>
            <Image source={require('../assets/izquierda.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan Premium</Text>
          <TouchableOpacity>
            <Image source={require('../assets/hogar.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/mono-premium.jpeg')} style={styles.bannerImage} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>¿Qué es el Plan Premium?</Text>
        <Text style={styles.description}>
          Obtén acceso a funciones exclusivas con nuestro Plan Premium. Acceso ilimitado a contenido premium, soporte 24/7 y mucho más.
        </Text>
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
          <Text style={styles.planButtonText}>Plan Premium 💼 60€</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
  bannerContainer2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: '#000000',
    paddingHorizontal: 10,
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  planButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  planButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  paymentButton: {
    flex: 1,
    backgroundColor: '#eeeeee',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  paymentButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
  },
});

export default PlanPremium;