const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <nav className="certificate-pagination" aria-label="Certificate pages">

      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="certificate-pagination__button"
      >
        Previous
      </button>

      <span className="certificate-pagination__label">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="certificate-pagination__button"
      >
        Next
      </button>

    </nav>
  );
};

export default Pagination;
