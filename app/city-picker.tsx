import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useCities } from '@/hooks/useData';
import { setPickedCity, usePickedCity } from '@/state/cityPick';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function CityPickerScreen() {
  const cities = useCities();
  const pickedCityId = usePickedCity();
  const [query, setQuery] = useState('');
  const styles = useThemedStyles(createStyles);

  const filtered = useMemo(
    () => cities.data?.filter((city) => city.name.toLowerCase().includes(query.toLowerCase())) ?? [],
    [cities.data, query],
  );

  const select = (id: string) => {
    setPickedCity(id);
    router.back();
  };

  if (cities.isLoading) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>Населённый пункт</Text>
      <Input
        style={styles.search}
        placeholder="Поиск города…"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => select(item.id)}>
            <Text style={[styles.rowName, item.id === pickedCityId && styles.rowNameActive]}>
              {item.name}
            </Text>
            <Text style={styles.rowDistrict}>{item.district}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<EmptyState title="Города не найдены" />}
      />
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: {
      paddingTop: space.lg,
    },
    title: {
      color: colors.text,
      fontFamily: font.displayBold,
      fontSize: 20,
      paddingHorizontal: space.lg,
      marginBottom: space.md,
    },
    search: {
      marginHorizontal: space.lg,
      marginBottom: space.sm,
    },
    list: {
      paddingHorizontal: space.lg,
      paddingBottom: space.xxl,
    },
    row: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
    },
    rowName: {
      color: colors.text,
      fontFamily: font.sansMedium,
      fontSize: 14,
    },
    rowNameActive: {
      color: colors.primary,
    },
    rowDistrict: {
      color: colors.muted,
      fontFamily: font.sans,
      fontSize: 12,
    },
  });
