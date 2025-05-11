import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const ExpenseChart = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>Harcama Analizi</Text>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#007AFF',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ExpenseChart; 