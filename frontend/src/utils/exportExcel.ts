/**
 * Exporta filas a un archivo .xls (SpreadsheetML) que Excel abre
 * con columnas separadas y encabezado con estilo.
 * Sin dependencias extra.
 */

export type ExcelColumn = {
  key: string;
  label: string;
  width?: number;
};

function escXml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function descargarExcel(
  filename: string,
  columns: ExcelColumn[],
  rows: Record<string, string | number | null | undefined>[],
  sheetName = "Datos"
) {
  const colsXml = columns
    .map((c) => `<Column ss:Width="${c.width ?? 18}" />`)
    .join("");

  const headerCells = columns
    .map(
      (c) =>
        `<Cell ss:StyleID="Header"><Data ss:Type="String">${escXml(c.label)}</Data></Cell>`
    )
    .join("");

  const body = rows
    .map((row) => {
      const cells = columns
        .map((c) => {
          const v = row[c.key];
          const isNum = typeof v === "number" && !Number.isNaN(v);
          const text = v == null ? "" : String(v);
          return `<Cell ss:StyleID="Cell"><Data ss:Type="${isNum ? "Number" : "String"}">${escXml(text)}</Data></Cell>`;
        })
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="Cell">
   <Font ss:Size="10" ss:Color="#0F172A"/>
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="Alt">
   <Font ss:Size="10" ss:Color="#0F172A"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center" ss:WrapText="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escXml(sheetName)}">
  <Table>
   ${colsXml}
   <Row ss:Height="22">${headerCells}</Row>
   ${body}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const name = filename.endsWith(".xls") ? filename : `${filename}.xls`;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
