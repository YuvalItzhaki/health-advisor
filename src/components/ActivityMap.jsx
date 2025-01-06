import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const mapOptions = {
  styles: [], // Add custom styles if needed
  disableDefaultUI: true,
};

const ActivityMap = ({ route }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCr9iRpOo1O9Vn-2GY3RR1IMzVs2LUnmkE',
  });

  const mapRef = useRef(null);

  const onLoad = useCallback(map => {
    mapRef.current = map;

    if (route && route.length) {
      const bounds = new window.google.maps.LatLngBounds();
      route.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);
    }
  }, [route]);

  if (!route || route.length === 0) {
    console.warn('No route data available');
    return <p>No route data available.</p>;
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={mapOptions}
      onLoad={onLoad}
    >
      <Polyline
        path={route}
        options={{
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
        }}
      />
      <Marker position={route[0]} label="Start" />
      <Marker position={route[route.length - 1]} label="End" />
    </GoogleMap>
  ) : (
    <p>Loading map...</p>
  );
};

export default React.memo(ActivityMap);
