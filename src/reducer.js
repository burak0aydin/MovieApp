// Action types
export const FETCH_INIT = 'FETCH_INIT';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';
export const SET_QUERY = 'SET_QUERY';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_WATCHLIST = 'SET_WATCHLIST';
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
export const ADD_WATCHLIST = 'ADD_WATCHLIST';
export const REMOVE_WATCHLIST = 'REMOVE_WATCHLIST';
export const CLEAR_WATCHLIST = 'CLEAR_WATCHLIST';
export const SET_PAGE = 'SET_PAGE';
export const LOAD_MORE_INIT = 'LOAD_MORE_INIT';
export const LOAD_MORE_SUCCESS = 'LOAD_MORE_SUCCESS';
export const LOAD_MORE_FAILURE = 'LOAD_MORE_FAILURE';
export const RESET_STATE = 'RESET_STATE';
export const APPLY_FILTERS = 'APPLY_FILTERS';

// Initial state
export const initialState = {
  shows: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  query: '',
  filters: {
    genre: '',
    language: '',
    minRating: 0
  },
  appliedFilters: {
    genre: '',
    language: '',
    minRating: 0
  },
  watchlist: [],
  currentPage: 1,
  pageSize: 6,
  isLoadingMore: false,
  hasMore: true,
  currentShowPage: 0
};

// Reducer function
export const showsReducer = (state, action) => {
  switch (action.type) {
    case FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMessage: ''
      };
    
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        shows: action.payload,
        currentPage: 1
      };
    
    case FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload
      };
    
    case SET_QUERY:
      return {
        ...state,
        query: action.payload
      };
    
    case SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case APPLY_FILTERS:
      return {
        ...state,
        appliedFilters: { ...state.filters },
        currentPage: 1
      };
    
    case SET_WATCHLIST:
      return {
        ...state,
        watchlist: action.payload
      };
    
    case ADD_WATCHLIST:
      if (state.watchlist.find(show => show.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload]
      };
    
    case REMOVE_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter(show => show.id !== action.payload)
      };
    
    case CLEAR_WATCHLIST:
      return {
        ...state,
        watchlist: []
      };
    
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload,
        currentPage: 1
      };
    
    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case LOAD_MORE_INIT:
      return {
        ...state,
        isLoadingMore: true
      };
    
    case LOAD_MORE_SUCCESS:
      // Duplicate'leri engellemek için sadece yeni dizileri ekle
      const existingIds = new Set(state.shows.map(show => show.id));
      const newShows = action.payload.shows.filter(show => !existingIds.has(show.id));
      
      return {
        ...state,
        isLoadingMore: false,
        shows: [...state.shows, ...newShows],
        currentShowPage: action.payload.page,
        hasMore: action.payload.shows.length > 0
      };
    
    case LOAD_MORE_FAILURE:
      return {
        ...state,
        isLoadingMore: false,
        isError: true,
        errorMessage: action.payload
      };
    
    case RESET_STATE:
      return {
        ...initialState,
        watchlist: state.watchlist // Watchlist'i koru
      };
    
    default:
      return state;
  }
};
