import ExcelJS from 'exceljs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with fonts
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CONFIG = {
    colors: {
        primary: '#4472C4',
        headerText: '#FFFFFF',
        bodyText: '#000000',
        alternateRow: '#F2F2F2',
        border: '#000000'
    },
    fonts: {
        headerSize: 12,
        bodySize: 11,
        titleSize: 16
    }
};

// Font configurations for pdfMake
pdfMake.fonts = {
    Amiri: {
        normal: 'https://fonts.gstatic.com/s/amiri/v17/J7aRnpd8CGxBHpUrtLMA7w.ttf',
        bold: 'https://fonts.gstatic.com/s/amiri/v17/J7acnpd8CGxBHp2VkaY6zp5yGAb.ttf'
    }
};

export const generateExcel = async (headers, data, title = 'تقرير') => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title, {
            views: [{ rightToLeft: true }]
        });

        // Add headers
        const headerRow = worksheet.addRow(headers.map(h => h.headerName));
        headerRow.font = { 
            bold: true,
            size: CONFIG.fonts.headerSize
        };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: CONFIG.colors.primary.replace('#', '') }
        };

        // Add data
        data.forEach((row, index) => {
            const dataRow = worksheet.addRow(
                headers.map(header => row[header.field] || '')
            );
            
            if (index % 2 === 0) {
                dataRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: CONFIG.colors.alternateRow.replace('#', '') }
                };
            }
        });

        // Style adjustments
        worksheet.columns.forEach(column => {
            column.width = 15;
            column.alignment = { vertical: 'middle', horizontal: 'right' };
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;

    } catch (error) {
        console.error('Error generating Excel:', error);
        throw error;
    }
};

export const generatePDF = async (headers, data, title = 'تقرير') => {
    try {
        const tableBody = [
            // Headers
            headers.map(header => ({
                text: header.headerName,
                style: 'tableHeader',
                alignment: 'center'
            })),
            // Data rows
            ...data.map((row, index) => 
                headers.map(header => ({
                    text: row[header.field]?.toString() || '—',
                    style: index % 2 === 0 ? 'tableCell' : 'tableCellAlternate',
                    alignment: 'center'
                }))
            )
        ];

        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 60, 40, 60],
            
            defaultStyle: {
                font: 'Amiri',
                fontSize: CONFIG.fonts.bodySize,
                direction: 'rtl'
            },
            
            content: [
                {
                    text: title,
                    style: 'title',
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: Array(headers.length).fill('*'),
                        body: tableBody
                    },
                    layout: {
                        fillColor: (rowIndex) => {
                            if (rowIndex === 0) return CONFIG.colors.primary;
                            return rowIndex % 2 === 0 ? CONFIG.colors.alternateRow : null;
                        }
                    }
                }
            ],
            
            styles: {
                title: {
                    fontSize: CONFIG.fonts.titleSize,
                    bold: true,
                    color: CONFIG.colors.primary
                },
                tableHeader: {
                    fontSize: CONFIG.fonts.headerSize,
                    bold: true,
                    color: CONFIG.colors.headerText
                },
                tableCell: {
                    fontSize: CONFIG.fonts.bodySize
                },
                tableCellAlternate: {
                    fontSize: CONFIG.fonts.bodySize
                }
            }
        };

        return new Promise((resolve) => {
            // Generate PDF as blob
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBuffer((buffer) => {
                resolve(buffer);
            });
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};