import React, { useState, useMemo } from "react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  onRowClick?: (record: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "داده‌ای برای نمایش وجود ندارد",
  searchable = true,
  searchPlaceholder = "جستجو...",
  pagination = true,
  pageSize = 10,
  className = "",
  onRowClick,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      columns.some((column) => {
        const value = column.render
          ? column.render(item[column.key as keyof T], item)
          : item[column.key as keyof T];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
      onSelectionChange?.([]);
    } else {
      setSelectedRows(paginatedData);
      onSelectionChange?.(paginatedData);
    }
  };

  const handleSelectRow = (row: T) => {
    const newSelection = selectedRows.includes(row)
      ? selectedRows.filter((item) => item !== row)
      : [...selectedRows, row];

    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const getValue = (column: Column<T>, record: T) => {
    if (column.render) {
      return column.render(record[column.key as keyof T], record);
    }
    return record[column.key as keyof T];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-blue-600 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header with Search */}
      {searchable && (
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
        </div>
      )}

      {/* Table */}
      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <div className="overflow-x-auto sm:overflow-x-visible">
          <table className="min-w-[800px] sm:min-w-[900px] md:min-w-[1000px] lg:min-w-full w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {selectable && (
                  <th className="px-6 py-4 text-right">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === paginatedData.length &&
                        paginatedData.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-700 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "left"
                        ? "text-left"
                        : "text-right"
                    } ${
                      column.sortable
                        ? "cursor-pointer hover:bg-gray-200 transition-colors"
                        : ""
                    }`}
                    onClick={() =>
                      column.sortable && handleSort(String(column.key))
                    }
                    style={{ width: column.width }}
                  >
                    <span className="hidden sm:inline">{column.title}</span>
                    <span className="sm:hidden">
                      {column.title.length > 8
                        ? column.title.substring(0, 8) + "..."
                        : column.title}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${selectedRows.includes(record) ? "bg-blue-50" : ""}`}
                    onClick={() => onRowClick?.(record)}
                  >
                    {selectable && (
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(record)}
                          onChange={() => handleSelectRow(record)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 ${
                          column.align === "center"
                            ? "text-center"
                            : column.align === "left"
                            ? "text-left"
                            : "text-right"
                        }`}
                      >
                        {getValue(column, record)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              نمایش {(currentPage - 1) * pageSize + 1} تا{" "}
              {Math.min(currentPage * pageSize, filteredData.length)} از{" "}
              {filteredData.length} رکورد
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                قبلی
              </button>

              {Array.from({ length: Math.min(15, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
