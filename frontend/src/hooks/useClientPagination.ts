import { useMemo, useState, useEffect } from "react";

export function useClientPagination<T>(items: T[], pageSize = 8) {
  const [pagina, setPagina] = useState(1);
  const total = items.length;
  const totalPaginas = Math.max(1, Math.ceil(total / pageSize) || 1);

  useEffect(() => {
    setPagina(1);
  }, [total, pageSize]);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  const filas = useMemo(() => {
    const start = (pagina - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pagina, pageSize]);

  return {
    pagina,
    totalPaginas,
    total,
    filas,
    setPagina,
    onAnterior: () => setPagina((p) => Math.max(1, p - 1)),
    onSiguiente: () => setPagina((p) => Math.min(totalPaginas, p + 1)),
  };
}
