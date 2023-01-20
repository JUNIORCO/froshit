import React from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text } from 'react-native';
import VerticalItemSeparatorComponent from "../components/common/VerticalItemSeparatorComponent";
import { useRefetchByUser } from "../hooks/useRefetchByUser";
import { useGetTeam } from "../hooks/query";
import TeamCard from "../components/team/TeamCard";
import useSession from "../hooks/useSession";

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


export default function TeamScreen() {
  const { profile } = useSession();
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

  const renderLeaderCard = ({ profile }) => <TeamCard {...profile} isLeader />;

  const renderFrosheeCard = ({ profile }) => <TeamCard {...profile}/>;

  const renderItem = ({ item: profile }) =>
    profile.role === 'Leader' ?
      renderLeaderCard({ profile })
      : renderFrosheeCard({ profile });

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{profile!.team.name}</Text>
      <SectionList
        sections={formattedTeam || []}
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
