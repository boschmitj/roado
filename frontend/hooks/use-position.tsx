"use client";

import { useEffect, useState } from "react";

type Position = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type UsePositionReturn = {
  position: Position | null;
  error: string | null;
  loading: boolean;
};

export function usePosition(): UsePositionReturn {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const successHandler = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
      setError(null);
      setLoading(false);
    };

    const errorHandler = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  return { position, error, loading };
}