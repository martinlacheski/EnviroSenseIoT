import DataTable, {
  ConditionalStyles,
  TableColumn,
} from "react-data-table-component";
import { customStyles, paginationOptions } from ".";
import { Spinner } from "react-bootstrap";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useState,
} from "react";
import { fetchData, paginationReducer } from "./paginationReducer";

interface DatatableProps {
  endpoint: string;
  title?: string;
  columns: TableColumn<any>[];
  perPage?: number;
  onRowClicked?: (row: any, e: React.MouseEvent<Element, MouseEvent>) => void;
  conditionalRowStyles?: ConditionalStyles<any>[] | undefined;
  filters?: any;
}

export interface DatatablePaginableHandle {
  filtersChange: (newFilters: any) => void;
  fetchFiltered: () => void;
  resetFilters: () => void;
}

const NoDataComponent = () => {
  return (
    <small className="text-center text-muted my-3">
      No hay datos para mostrar
    </small>
  );
};

const ProgressComponent = () => {
  return (
    <div
      className="mb-3 d-flex align-items-center"
      style={{ textAlign: "center" }}
    >
      <Spinner animation="grow" variant="secondary" />
      <small className="ms-2 text-muted">Cargando...</small>
    </div>
  );
};

export const DatatablePaginable = forwardRef(
  (
    {
      endpoint,
      title,
      columns,
      perPage = 15,
      onRowClicked,
      conditionalRowStyles,
    }: DatatableProps,
    ref
  ) => {
    const [rowsPerPage] = useState(perPage);
    const [initialState] = useState({
      data: [],
      loading: false,
      totalRows: 0,
      perPage: rowsPerPage || 15,
      filters: {},
    });
    const [state, dispatch] = useReducer(paginationReducer, initialState);

    useImperativeHandle(ref, () => ({
      filtersChange: (newFilters: any) => {
        dispatch({ type: "FILTERS_CHANGE", newFilters });
      },
      fetchFiltered: () => {
        dispatch({ type: "FILTERS_CHANGE", newFilters: state.filters });
        fetchData(endpoint, 1, state, dispatch);
      },
      resetFilters: () => {
        dispatch({ type: "RESET_FILTERS" });
        dispatch({ type: "FILTERS_CHANGE", newFilters: {} });
        fetchData(endpoint, 1, initialState, dispatch);
      },
    }));

    useEffect(() => {
      fetchData(endpoint, 1, state, dispatch);
    }, []);

    const handlePageChange = async (page: number) => {
      dispatch({ type: "PAGE_CHANGE", page });
      fetchData(endpoint, page, state, dispatch);
    };

    const handleRowsPerPageChange = async (
      newPerPage: number,
      page: number
    ) => {
      dispatch({ type: "ROWS_PER_PAGE_CHANGE", newPerPage, page });
      fetchData(endpoint, page, { ...state, perPage: newPerPage }, dispatch);
    };

    // useEffect(() => {
    //   dispatch({ type: "FILTERS_CHANGE", newFilters: filters });
    // }, [filters]);

    const memoizedDataTable = useMemo(
      () => (
        <DataTable
          responsive
          title={title}
          columns={columns}
          data={state.data}
          dense
          striped
          noDataComponent={<NoDataComponent />}
          progressPending={state.loading}
          progressComponent={<ProgressComponent />}
          pagination
          paginationServer
          paginationTotalRows={state.totalRows}
          paginationComponentOptions={paginationOptions}
          onChangeRowsPerPage={handleRowsPerPageChange}
          onChangePage={handlePageChange}
          customStyles={customStyles}
          paginationRowsPerPageOptions={[perPage, 20, 30, 40, 50, 100]}
          paginationPerPage={state.perPage}
          highlightOnHover={onRowClicked !== undefined}
          pointerOnHover={onRowClicked !== undefined}
          onRowDoubleClicked={onRowClicked}
          conditionalRowStyles={conditionalRowStyles}
        />
      ),
      [
        title,
        columns,
        state.data,
        state.loading,
        state.totalRows,
        handleRowsPerPageChange,
        handlePageChange,
      ]
    );

    return (
      <div className="border rounded" style={{ overflow: "hidden" }}>
        {memoizedDataTable}
      </div>
    );
  }
);
