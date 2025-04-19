import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  let [jobs, setJobs] = useState([]);
  let [page, setPage] = useState(1);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState('');
  let [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  let fetchJobs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError('');
    try {
      let response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      let data = response.data.data;
      if (data.length === 0) setHasMore(false);
      setJobs((prev) => [...prev, ...data]);
    } catch (err) {
      setError('Failed to fetch jobs');
    }
    setLoading(false);
  };

  let loadMore = () => {
    if (!loading && hasMore) setPage((prev) => prev + 1);
  };

  let renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
      {!loading && jobs.length === 0 ? <Text>No jobs found.</Text> : null}
    </View>
  );
}

let styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 12, marginBottom: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10 }
});
