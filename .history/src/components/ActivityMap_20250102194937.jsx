import React from 'react';
import { GoogleMap, Polyline, LoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const ActivityMap = ({ route }) => {
  const center = route.length ? route[0] : { lat: 0, lng: 0 };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCr9iRpOo1O9Vn-2GY3RR1IMzVs2LUnmkE">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        <Polyline
          path={route}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default ActivityMap;
