export interface Ambiente {
    _id:          string;
    id:           string;
    company:      Company;
    city:         AmbienteCity;
    type:         Type;
    name:         string;
    address:      string;
    gps_location: string;
    description:  string;
}

export interface AmbienteCity {
    id:          string;
    province:    PurpleProvince;
    name:        string;
    postal_code: string;
}

export interface PurpleProvince {
    id:      string;
    country: Type;
    name:    string;
}

export interface Type {
    id:   string;
    name: string;
}

export interface Company {
    id:      string;
    name:    string;
    address: string;
    city:    CompanyCity;
    email:   string;
    phone:   string;
    webpage: string;
    logo:    string;
}

export interface CompanyCity {
    id:          string;
    province:    FluffyProvince;
    name:        string;
    postal_code: string;
}

export interface FluffyProvince {
    id:      string;
    country: Country;
    name:    string;
}

export interface Country {
    id:         string;
    collection: string;
}
