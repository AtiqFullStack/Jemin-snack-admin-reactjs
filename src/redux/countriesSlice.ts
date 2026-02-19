import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  languages?: Record<string, string>;
}

interface CountriesState {
  countries: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountriesState = {
  countries: [],
  loading: false,
  error: null,
};

export const fetchCountries = createAsyncThunk('countries/fetch', async () => {
  const response = await axios.get(
    'https://restcountries.com/v3.1/independent?status=true&fields=languages,capital,name'
  );
  return response.data;
});

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch countries';
      });
  },
});

export const selectCountries = (state: { countries: CountriesState }) =>
  state.countries.countries;
export const selectCountriesLoading = (state: { countries: CountriesState }) =>
  state.countries.loading;

export const filterCountries = (countries: Country[], searchTerm: string) => {
  if (!searchTerm) return countries;
  const term = searchTerm.toLowerCase();
  return countries.filter(
    (country) =>
      country.name.common.toLowerCase().includes(term) ||
      country.name.official.toLowerCase().includes(term)
  );
};

export default countriesSlice.reducer;
