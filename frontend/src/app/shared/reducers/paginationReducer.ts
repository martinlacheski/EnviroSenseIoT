import api from "../../../api/api";

export interface StateReducer<T> {
    data: T[];
    loading: boolean;
    page?: number;
    totalRows: number;
    perPage: number;
    filters: any;
    error?: string;
}

export type ActionReducer<T> =
    | { type: "FETCH_START" }
    | { type: "FETCH_SUCCESS"; data: T[]; totalRows: number }
    | { type: "FETCH_FAILURE" }
    | { type: "PAGE_CHANGE"; page: number }
    | { type: "ROWS_PER_PAGE_CHANGE"; newPerPage: number; page: number }
    | { type: "FILTERS_CHANGE"; newFilters: any }
    | { type: "RESET_FILTERS" };

const initialState = {
    data: [],
    loading: false,
    totalRows: 0,
    perPage: 10,
    filters: {},
};

const paginationReducer = <T>(state: StateReducer<T>, action: ActionReducer<T>): StateReducer<T> => {
    switch (action.type) {
        case "FETCH_START":
            return { ...state, loading: true };
        case "FETCH_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.data,
                totalRows: action.totalRows,
            };
        case "FETCH_FAILURE":
            return { ...state, loading: false, error: "Error al cargar los datos" };
        case "PAGE_CHANGE":
            return { ...state, page: action.page };
        case "ROWS_PER_PAGE_CHANGE":
            return { ...state, perPage: action.newPerPage, page: action.page }; 
        case "FILTERS_CHANGE":
            return { ...state, filters: action.newFilters }; 
        case "RESET_FILTERS":
            return { ...state, filters: {} }; 
        default:
            return state;
    }
};

const fetchData = async <T>(endpoint: string, page: number, state: StateReducer<T>, dispatch: React.Dispatch<ActionReducer<T>>) => {
    dispatch({ type: "FETCH_START" });
    try {
        const { data: responseData } = await api.get(`${endpoint}/paginated`, {
            params: {
                page,
                limit: state.perPage,
                ...state.filters,
            },
        });
        dispatch({
            type: "FETCH_SUCCESS",
            data: responseData.items,
            totalRows: responseData.total_items,
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: "FETCH_FAILURE" });
    }
};

export { initialState, paginationReducer, fetchData };
