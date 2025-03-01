import { createContext, useContext, useState } from "react";

type CitySelectorContextType = {
    selectedCityId: string;
    setSelectedCityId: (cityId: string) => void;
};

const CitySelectorContext = createContext<CitySelectorContextType | undefined>(undefined);

export const CitySelectorProvider = ({ children }) => {
    const [selectedCityId, setSelectedCityId] = useState("");

    return (
        <CitySelectorContext.Provider value={{ selectedCityId, setSelectedCityId }}>
            {children}
        </CitySelectorContext.Provider>
    );
};


export const useCitySelectorContext = () => {
    const context = useContext(CitySelectorContext);
    if (!context) {
        throw new Error("useCitySelectorContext debe usarse dentro de un CitySelectorProvider");
    }
    return context;
};

