import { Link } from "react-router-dom";

export type Crumb = { label: string; to?: string };

type Props = { items: Crumb[] };

/**
 * Migas de pan con enlaces reales (no texto muerto).
 * El último ítem no es enlace (página actual).
 */
export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="app-breadcrumb" aria-label="Miga de pan">
      <Link to="/dashboard" className="app-breadcrumb__home" title="Inicio">
        <i className="bi bi-house-fill"></i>
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="app-breadcrumb__item">
            <span className="app-breadcrumb__sep">›</span>
            {isLast || !item.to ? (
              <strong className="app-breadcrumb__current">{item.label}</strong>
            ) : (
              <Link to={item.to} className="app-breadcrumb__link">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
