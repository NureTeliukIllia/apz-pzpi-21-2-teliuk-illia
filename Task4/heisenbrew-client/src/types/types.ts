
export type ButtonType = "button" | "submit" | "reset" | undefined;



export type PaginationProps = {
    currentPage: number;
    onChangePage: (page: number) => void;
    totalPages: number;
};
