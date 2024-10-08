import React from 'react';
import { StyleSheet } from 'react-native';
import { useGetOffers } from "../hooks/query";
import OfferCard from "../components/offers/OfferCard";
import { Card } from 'react-native-paper';
import { commonStyles } from "./styles/Common.styles";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
  },
});


export default function OffersScreen() {
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: offers,
    error: teamError,
  } = useGetOffers();

  return (
    <Card style={commonStyles.mainCard}>
      {offers?.map(offer => <OfferCard key={offer.id} {...offer}/>)}
    </Card>
  )
}
