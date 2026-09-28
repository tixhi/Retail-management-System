import { useEffect, useState } from 'react';
import api from '../services/api';

export default function useApiCollection(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.get(endpoint)
      .then((response) => {
        if (active) setItems(response.data.data || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.response?.data?.message || `Could not load ${endpoint.replace('/', '')} from the server.`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [endpoint]);

  return { items, loading, error, setItems };
}
