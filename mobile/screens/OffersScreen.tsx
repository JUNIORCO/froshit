import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text } from 'react-native';
import VerticalItemSeparatorComponent from "../components/common/VerticalItemSeparatorComponent";
import { useRefetchByUser } from "../hooks/useRefetchByUser";
import { useGetOffers } from "../hooks/query";
import OfferCard from "../components/offers/OfferCard";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 24,
    marginVertical: 16,
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
  },
});


export default function TeamScreen() {
  const {
    isLoading: teamIsLoading,
    isError: teamIsError,
    data: offers,
    error: teamError,
  } = useGetOffers();
  const { isRefetchingByUser, refetchByUser } = useRefetchByUser();

  const renderOfferCard = ({ item: offer }) => <OfferCard {...offer}/>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Offers</Text>
      <FlatList
        data={offers}
        showsVerticalScrollIndicator={false}
        renderItem={renderOfferCard}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingByUser}
            onRefresh={refetchByUser}
          />
        }
      />
    </SafeAreaView>
  )
}
