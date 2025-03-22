import { defaultThemes, PaginationOptions, TableStyles } from "react-data-table-component";

export const customStyles: TableStyles = {
  header: {
    style: {
      minHeight: "50px",
      fontSize: "20px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  pagination: {
    style: {
      minHeight: "56px",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
};

export const paginationOptions: PaginationOptions =
{
  rowsPerPageText: "Filas por página:",
  rangeSeparatorText: "de",
  noRowsPerPage: false,
}