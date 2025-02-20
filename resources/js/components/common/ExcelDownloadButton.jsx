// components/common/ExcelDownloadButton.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ExcelExportWrapper from './ExcelExportWrapper';

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

    // Función recursiva para extraer texto de elementos React
    const extractText = (element) => {
        if (!element) return '';
        if (typeof element === 'string') return element;
        if (Array.isArray(element)) return element.map(extractText).join(' ');
        if (React.isValidElement(element)) {
            if (element.type?.name === 'StatusDropdown') {
                const { item, statusField = 'status', options = [] } = element.props;
                const status = item?.[statusField];
                const option = options.find(opt => opt.value === status) ||
                             defaultOptions.find(opt => opt.value === status);
                return option?.label || status || '';
            }
            if (element.props?.children) {
                return extractText(element.props.children);
            }
        }
        return String(element);
    };

    const handleExport = useCallback(async ({ XLSX, saveAs }) => {
        // Extraer y transformar los datos
        const excelData = data.map(item => {
            const row = {};
            columns
                .filter(column => column.key !== 'actions')
                .forEach(column => {
                    const value = column.render ? column.render(item) : item[column.key];
                    row[column.header] = extractText(value).trim();
                });
            return row;
        });

        // Crear y configurar el workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData, {
            header: columns
                .filter(column => column.key !== 'actions')
                .map(column => column.header)
        });

        // Aplicar estilos
        const range = XLSX.utils.decode_range(ws['!ref']);
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

        // Aplicar estilos al worksheet
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
                if (!ws[cellRef]) continue;
                ws[cellRef].s = row === 0 ? headerStyle : {
                    border: headerStyle.border,
                    alignment: { vertical: 'center' }
                };
            }
        }

        // Ajustar anchos de columna
        ws['!cols'] = columns
            .filter(column => column.key !== 'actions')
            .map(column => ({
                wch: Math.max(
                    column.header.length,
                    ...excelData.map(row => String(row[column.header] || '').length)
                )
            }));

        // Generar y descargar el archivo
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
            bookSST: false
        });

        const blob = new Blob([wbout], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, filename);
    }, [data, columns, filename]);

    return (
        <ExcelExportWrapper
            onExport={handleExport}
            isDisabled={isDisabled}
            className={className}
        />
    );
};

ExcelDownloadButton.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            render: PropTypes.func
        })
    ).isRequired,
    filename: PropTypes.string,
    hasPermission: PropTypes.bool,
    isLoading: PropTypes.bool,
    className: PropTypes.string
};

export default ExcelDownloadButton;