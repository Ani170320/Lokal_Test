import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const data = await response.json();

      if (data.results?.length > 0) {
        setJobs((prev) => [...prev, ...data.results]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator
        style={{ margin: 16 }}
        size="large"
        color="#007AFF"
      />
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text>No jobs available.</Text>
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={{ color: 'red', fontSize: 16, marginBottom: 10 }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchJobs}
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: '#fff' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: '#f0f4ff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
        {item.primary_details?.Place || 'Location not specified'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Job List Title */}
      <View style={{ paddingVertical: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
          Job List
        </Text>
      </View>

      {renderError()}
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={fetchJobs}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

export default App;
