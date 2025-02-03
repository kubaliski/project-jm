import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx-js-style';

const ExcelDownloadButton = ({
  data,
  columns,
  filename = 'download.xlsx',
  hasPermission = false,
  isLoading = false,
  className = ''
}) => {
  if (!hasPermission) return null;

  const isDisabled = isLoading || data.length === 0;

  const handleDownload = () => {
    if (isDisabled) return;

    try {
      // Función recursiva para extraer texto de elementos React
      const extractText = (element) => {
        if (!element) return '';
        if (typeof element === 'string') return element;
        if (Array.isArray(element)) return element.map(extractText).join(' ');
        if (React.isValidElement(element)) {
          // StatusDropdown special case
          if (element.type?.name === 'StatusDropdown') {
            const { item, statusField = 'status', options = [] } = element.props;
            const status = item?.[statusField];
            // Primero intentamos encontrar la opción en las props del componente
            let option = options.find(opt => opt.value === status);

            // Si no encontramos la opción en las props, usamos las opciones por defecto del StatusDropdown
            if (!option) {
              const defaultOptions = [
                { value: 'pending', label: 'Pendiente' },
                { value: 'in_progress', label: 'En tramitación' },
                { value: 'completed', label: 'Finalizado' },
                { value: 'spam', label: 'Spam' }
              ];
              option = defaultOptions.find(opt => opt.value === status);
            }

            // Retornamos la etiqueta si la encontramos, o el valor como fallback
            return option?.label || status || '';
          }
          // Regular React elements
          if (element.props && element.props.children) {
            return extractText(element.props.children);
          }
          return '';
        }
        return String(element);
      };


      // Extraer y transformar los datos
      const excelData = data.map(item => {
        const row = {};
        columns
          .filter(column => column.key !== 'actions')
          .forEach(column => {
            if (column.render) {
              const rendered = column.render(item);
              row[column.header] = extractText(rendered).trim();
            } else {
              row[column.header] = item[column.key];
            }
          });
        return row;
      });

      // Crear el workbook y worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData, {
        header: columns
          .filter(column => column.key !== 'actions')
          .map(column => column.header)
      });

      // Aplicar estilos
      const range = XLSX.utils.decode_range(ws['!ref']);

      // Estilo para encabezados
      const headerStyle = {
        font: { bold: true, sz: 12, color: { rgb: '000000' } },
        fill: { fgColor: { rgb: 'E0E6EF' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        },
        alignment: { horizontal: 'center', vertical: 'center' }
      };

      // Estilo para celdas de datos
      const cellStyle = {
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        },
        alignment: { vertical: 'center' }
      };

      // Aplicar estilos a todas las celdas
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[cellRef]) continue;

          ws[cellRef].s = row === 0 ? headerStyle : cellStyle;
        }
      }

      // Ajustar ancho de columnas
      const colWidths = columns
        .filter(column => column.key !== 'actions')
        .map(column => ({
          wch: Math.max(
            column.header.length,
            ...excelData.map(row =>
              String(row[column.header] || '').length
            )
          )
        }));

      ws['!cols'] = colWidths;

      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // Generar el archivo
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array',
        bookSST: false
      });

      // Descargar usando file-saver
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, filename);

    } catch (error) {
      console.error('Error al generar el archivo Excel:', error);
    }
  };

  const baseStyles = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const enabledStyles = "text-white bg-indigo-600 hover:bg-indigo-700";
  const disabledStyles = "text-gray-400 bg-gray-100 cursor-not-allowed";

  const buttonStyles = className || `${baseStyles} ${isDisabled ? disabledStyles : enabledStyles}`;

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDisabled}
      className={buttonStyles}
      title={
        isLoading
          ? "Cargando datos..."
          : data.length === 0
            ? "No hay datos para exportar"
            : "Descargar Excel"
      }
    >
      <ArrowDownTrayIcon className={`h-5 w-5 mr-2 ${isDisabled ? 'text-gray-400' : ''}`} />
      <span>Descargar Datos</span>
    </button>
  );
};

ExcelDownloadButton.propTypes = {
  // Los datos que se exportarán a Excel
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  // Definición de las columnas que incluye key, header y opcionalmente render
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      render: PropTypes.func
    })
  ).isRequired,

  // Nombre del archivo Excel a descargar
  filename: PropTypes.string,

  // Booleano que determina si el usuario tiene permiso para descargar
  hasPermission: PropTypes.bool,

  // Booleano que indica si los datos están cargando
  isLoading: PropTypes.bool,

  // Clases CSS adicionales para el botón
  className: PropTypes.string
};

export default ExcelDownloadButton;