import React from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text } from 'react-native';
import VerticalItemSeparatorComponent from "../components/common/VerticalItemSeparatorComponent";
import { useRefetchByUser } from "../hooks/useRefetchByUser";
import { useGetTeam } from "../hooks/query";
import LeaderCard from "../components/team/LeaderCard";
import FrosheeCard from "../components/team/FrosheeCard";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    height: '100%',
  },
  title: {
    fontSize: 24,
    marginTop: 16,
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
    data: team,
    error: teamError,
  } = useGetTeam();
  const { isRefetchingByUser, refetchByUser } = useRefetchByUser();

  const formattedTeam = team?.reduce((accum, member) => {
    if (member.role === 'Leader') {
      accum[0].data.push(member);
    } else if (member.role === 'Froshee') {
      accum[1].data.push(member);
    }
    return accum;
  }, [
    {
      title: 'Leaders',
      data: [],
    },
    {
      title: 'Froshees',
      data: [],
    }
  ]);

  const renderLeaderCard = ({ profile }) => <LeaderCard {...profile}/>;

  const renderFrosheeCard = ({ profile }) => <FrosheeCard {...profile}/>;

  const renderItem = ({ item: profile }) =>
    profile.role === 'Leader' ?
      renderLeaderCard({ profile })
      : renderFrosheeCard({ profile });

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{team[0]?.teamId.name}</Text>
      <SectionList
        sections={formattedTeam}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={VerticalItemSeparatorComponent}
        refreshing={isRefetchingByUser}
        onRefresh={refetchByUser}
      />
    </SafeAreaView>
  )
}
