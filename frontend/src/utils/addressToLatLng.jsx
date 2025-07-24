// src/utils/geocodingUtils.js

export const addressToLatLng = (geocoderInstance, address) => {
  return new Promise((resolve, reject) => {
    if (!geocoderInstance || !address) return resolve(null);

    geocoderInstance.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        resolve(latLng);
      } else {
        console.error("Geocode failed:", status);
        resolve(null);
      }
    });
  });
};
