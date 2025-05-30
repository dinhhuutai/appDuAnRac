import React, { createContext, useEffect, useState } from 'react';

export const WeightContext = createContext();

export const WeightProvider = ({ children }) => {
  const [weight, setWeight] = useState(0);

  return (
    <WeightContext.Provider value={{ setWeight, weight }}>
      {children}
    </WeightContext.Provider>
  );
};
