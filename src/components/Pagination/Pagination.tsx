import React from "react";
import { Pagination } from "antd";
import "./Pagination.css";

interface PaginationComponentProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string; 
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  pageSize,
  total,
  onPageChange,
  className
}) => {
  return (
    <div className="custom-pagination-container">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        showSizeChanger={false} // Disable page size changer
        className={`custom-pagination ${className}`}
        align={"end"}
      />
    </div>
  );
};

export default PaginationComponent;
