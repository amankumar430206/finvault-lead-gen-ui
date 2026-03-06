const PageLoader = ({ tableColumns = 5, tableRows = 7, listRows = 8, withToolbar = true, withPagination = true }) => (
  <div className="space-y-6 animate-pulse">
    {/* Page Header / Toolbar */}
    {withToolbar && (
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-inputbg rounded-lg w-48 mb-2" />
          <div className="h-4 bg-inputbg rounded w-32" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 bg-inputbg border  border-[var(--border-clr)] rounded-lg px-4 w-24" />
          <div className="h-10 bg-inputbg border  border-[var(--border-clr)] rounded-lg px-4 w-28 flex items-center justify-center">
            <div className="w-5 h-5 bg-inputbg rounded-full mx-auto" />
          </div>
        </div>
      </div>
    )}

    {/* Filters/Search Bar */}
    <div className="bg-inputbg border  border-[var(--border-clr)] rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-4 h-4 bg-inputbg rounded-full" />
          </div>
          <div className="h-11 bg-inputbg border  border-[var(--border-clr)] rounded-lg pl-10 w-full" />
        </div>
        <div className="flex gap-2 flex-1 sm:flex-none">
          <div className="h-11 bg-inputbg border  border-[var(--border-clr)] rounded-lg px-4 flex-1" />
          <div className="h-11 bg-inputbg border  border-[var(--border-clr)] rounded-lg w-28 px-4" />
        </div>
      </div>
    </div>

    {/* Table + Mobile List */}
    <div className="space-y-4">
      {/* Desktop Table Skeleton */}
      <TableSkeleton columns={tableColumns} rows={tableRows} />

      {/* Mobile List Skeleton */}
      <ListSkeleton rows={listRows} />
    </div>

    {/* Pagination */}
    {withPagination && (
      <div className="flex items-center justify-between pt-4 border-t  border-[var(--border-clr)]">
        <div className="h-6 bg-inputbg rounded w-24" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${i === 2 ? "bg-accent w-6" : "bg-inputbg"}`}
            />
          ))}
        </div>
        <div className="h-6 bg-inputbg rounded w-28 flex items-center justify-end gap-1 pr-2">
          <div className="w-6 h-6 bg-inputbg rounded" />
          <div className="w-8 h-6 bg-inputbg rounded" />
          <div className="w-6 h-6 bg-inputbg rounded" />
        </div>
      </div>
    )}
  </div>
);

// Include the skeleton components
const TableSkeleton = ({ columns = 6, rows = 5 }) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b  border-[var(--border-clr)]">
          <th className="px-5 py-3.5 w-10">
            <div className="w-4 h-4 rounded border-2 border-white/20 bg-inputbg animate-pulse" />
          </th>
          {Array.from({ length: columns }, (_, i) => (
            <th key={i} className="px-4 py-3.5">
              <div className="h-3 bg-inputbg animate-pulse rounded w-16" />
            </th>
          ))}
          <th className="px-4 py-3.5 w-10" />
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={rowIndex} className="border-b  border-[var(--border-clr)]">
            <td className="px-5 py-3.5">
              <div className="w-4 h-4 rounded border-2 border-white/15 bg-inputbg animate-pulse" />
            </td>
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-inputbg rounded-lg animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 bg-inputbg animate-pulse rounded w-24" />
                  <div className="h-3 bg-inputbg animate-pulse rounded w-32" />
                </div>
              </div>
            </td>
            <td className="px-4 py-3.5">
              <div className="h-4 bg-inputbg animate-pulse rounded w-20" />
              <div className="h-3 bg-inputbg animate-pulse rounded w-16 mt-1" />
            </td>
            <td className="px-4 py-3.5">
              <div className="h-6 bg-inputbg border  border-[var(--border-clr)] inline-block px-2 py-1 rounded-md animate-pulse w-16" />
            </td>
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-1.5 h-6 bg-inputbg border  border-[var(--border-clr)] inline-flex px-2.5 py-1 rounded-full animate-pulse w-20" />
            </td>
            <td className="px-4 py-3.5 text-right">
              <div className="h-4 bg-inputbg animate-pulse rounded w-16 inline-block" />
            </td>
            <td className="px-4 py-3.5">
              <div className="w-2 h-3 bg-inputbg animate-pulse rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ListSkeleton = ({ rows = 5 }) => (
  <div className="md:hidden space-y-3">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="p-4 border-b  border-[var(--border-clr)] bg-inputbg rounded-lg animate-pulse">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-inputbg rounded-xl" />
          <div className="flex-1 space-y-1">
            <div className="h-5 bg-inputbg rounded w-32" />
            <div className="h-4 bg-inputbg rounded w-48" />
          </div>
          <div className="w-2 h-3 bg-inputbg rounded" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-inputbg rounded-full w-3" />
            <div className="h-5 bg-inputbg rounded w-16" />
          </div>
          <div className="h-6 bg-inputbg border  border-[var(--border-clr)] inline-flex px-3 py-1 rounded-full w-20" />
        </div>
      </div>
    ))}
  </div>
);

export { PageLoader, TableSkeleton, ListSkeleton };
