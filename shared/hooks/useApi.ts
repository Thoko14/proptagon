/**
 * Shared API hook for HTTP requests
 * Shared API hook for HTTP requests
 */

import { useState, useCallback } from 'react';
import { ApiResponse } from '../types';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useApi = (options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const request = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const result: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An error occurred');
      }

      setData(result.data);
      options.onSuccess?.(result.data);
      return result.data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options.onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const get = useCallback((url: string) => {
    return request(url, { method: 'GET' });
  }, [request]);

  const post = useCallback((url: string, body: any) => {
    return request(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [request]);

  const put = useCallback((url: string, body: any) => {
    return request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }, [request]);

  const del = useCallback((url: string) => {
    return request(url, { method: 'DELETE' });
  }, [request]);

  return {
    loading,
    error,
    data,
    request,
    get,
    post,
    put,
    delete: del,
  };
}; 