import { useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type FetchConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: BodyInit | null;
};

export function useFetch<T>(
  url: string,
  config?: FetchConfig,
  initialData: T | null = null,
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState({ ...state, loading: true });

    fetch(url, config)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) =>
        setState({ data: initialData, loading: false, error: error.message }),
      );
  }, [url, config]);

  return state;
}
