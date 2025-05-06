export interface RegionProps {
     _id?: string;
     name: string;
     is_active: boolean;
     created_at?: Date;
     totalCountries?: number;
     totalCities?: number;
}

export interface CitiesProps {
     _id?: string;
     name: string;
     is_active: boolean;
     created_at?: Date;
     country_id: string;
}

export interface CountryProps {
     _id: string;
     country_code: string
     name: string;
     region_id: string;
     is_active: boolean;
     created_at: Date;
}
