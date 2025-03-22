import DataTable, { TableColumn } from "react-data-table-component";
import { customStyles, paginationOptions } from ".";
import { Spinner } from "react-bootstrap";
import { useMemo } from "react";

interface DatatableProps {
  title?: string;
  columns: TableColumn<any>[];
  data: any;
  loading: boolean;
  totalRows: number;
  handleRowsPerPageChange: (newPerPage: number, page: number) => Promise<void>;
  handlePageChange: (page: number) => Promise<void>;
  clickableRows?: boolean;
  onRowClicked?: (row: any) => void;
  conditionalRowStyles?: any[];
  perPage?: number;
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

export const Datatable = ({
  title,
  columns,
  data,
  loading,
  totalRows,
  handleRowsPerPageChange,
  handlePageChange,
  clickableRows = false,
  onRowClicked,
  conditionalRowStyles,
  perPage = 15,
}: DatatableProps) => {
  const memoizedDataTable = useMemo(
    () => (
      <DataTable
        responsive
        title={title}
        columns={columns}
        data={data}
        dense
        striped
        noDataComponent={<NoDataComponent />}
        progressPending={loading}
        progressComponent={<ProgressComponent />}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationComponentOptions={paginationOptions}
        onChangeRowsPerPage={handleRowsPerPageChange}
        onChangePage={handlePageChange}
        // customStyles={customStyles}
        customStyles={{
          ...customStyles,
          headRow: {
            style: {
              borderTopStyle: title ? "solid" : "none", // Validación con un operador ternario
              borderTopWidth: title ? "1px" : "0px", // Ajusta el ancho según la validación si es necesario
              borderTopColor: title ? "#e0e0e0" : "transparent", // Cambia el color si no quieres que se vea la línea
            },
          },
        }}
        paginationRowsPerPageOptions={[perPage, 30, 50, 100]}
        paginationPerPage={perPage}
        highlightOnHover={clickableRows}
        pointerOnHover={clickableRows}
        onRowDoubleClicked={clickableRows ? onRowClicked : undefined}
        conditionalRowStyles={conditionalRowStyles}
      />
    ),
    [
      title,
      columns,
      data,
      loading,
      totalRows,
      handleRowsPerPageChange,
      handlePageChange,
    ]
  );

  return (
    <div className="border rounded" style={{ overflow: "hidden" }}>
      {memoizedDataTable}
    </div>
  );
};
