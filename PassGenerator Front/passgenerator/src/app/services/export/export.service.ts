import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { Cuenta } from '../../model/cuentaSchema';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Exporta la lista recibida por parametro a un archivo JSON.
   *
   * @param lista - Lista de cuentas para ser exportada.
   *
   * @returns {void} - Sin retorno. Crea un archivo JSON y lo descarga.
   */
  exportJson(lista:Cuenta[]): void{
    const jsonData = JSON.stringify(lista, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords.json`;
    a.click();
    URL.revokeObjectURL(url);
  }


  /**
   * Exporta la lista de cuentas a un archivo Excel.
   *
   * @param lista - Lista de cuentas que se van a exportar. Cada cuenta debe tener propiedades como site, password,
   *                createTime y expirationTime.
   *
   * @returns {void} - No retorna nada. Crea un archivo Excel y lo descarga.
   */
  exportExcel(lista: Cuenta[]){
    // Crear un nuevo libro de trabajo (workbook) y una hoja de trabajo (worksheet)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Passwords');
    const headers = ['Fecha de creación', 'Fecha de expiración', 'Sitio', 'Password'];

    const cellBorder = {
      top: { style: 'thin' as ExcelJS.BorderStyle, color: {argb: 'FFFFFF'} },
      bottom: { style: 'thin' as ExcelJS.BorderStyle, color: {argb: 'FFFFFF'} },
      left: { style: 'thin' as ExcelJS.BorderStyle, color: {argb: 'FFFFFF'} },
      right: { style: 'thin' as ExcelJS.BorderStyle, color: {argb: 'FFFFFF'} }
    };

    worksheet.addRow(headers);

    // Agregar los datos
    lista.forEach(account => {
      const values = Object.values(account);
      worksheet.addRow(values);
    });

    // Aplicar estilos a las cabeceras
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.alignment = {
         horizontal: 'center',
         vertical: 'middle'
         };
      cell.font = {
        size: 20,
        bold: true,
        color: {argb: 'd46519'}
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '334155' },
      };
      cell.border = cellBorder;
    });

    // Definir ancho de columnas
    worksheet.columns.forEach(column => {
      column.width = 40; // Ancho en píxeles
    });

    //Aplicar estilos al resto de celdas que no sean de las cabeceras
    worksheet.eachRow({includeEmpty: false}, (row, rowIndex) => {
      if(rowIndex >1){
        row.eachCell((cell) => {
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
          cell.font = {
            color: {argb: 'FFFFFF'},
            bold: true,
          };
          cell.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor: { argb: '374151' },
          }
          cell.border = cellBorder;
        });
      }
    });

    // Exportar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passwords_Excel.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }


  /**
   * Exporta la lista de cuentas a un archivo PDF.
   *
   * @param lista - Lista de cuentas que se van a exportar. Cada cuenta debe tener propiedades como site, password,
   *                createTime y expirationTime.
   *
   * @returns {void} - No retorna nada. Crea un archivo PDF y lo descarga.
   */
  exportPDF(lista:Cuenta[]){
    //Se crea un nuevo PDF
    const doc = new jsPDF('p', 'pt', 'letter');

    //Obtener el ancho del documento
    const pageWidth = doc.internal.pageSize.getWidth();

    let title = 'Lista de cuentas';
    doc.setFontSize(24);
    doc.setTextColor(212, 101, 25);

    //Se obtiene el ancho del título
    const textWidth = doc.getTextWidth(title);

    //Se calcula la posición central para el título
    const xPos = (pageWidth - textWidth)/2;

    doc.text(title, xPos, 40);

    const headers = ['Sitio', 'Password', 'Fecha de creación', 'Fecha de expiración'];

    //Se recorre la lista de cuentas y se obtienen los valores
    const body = lista.map((account) => {
      return [
        account?.site || 'N/A',
        account?.password || 'N/A',
        account?.createTime || 'N/A',
        account?.expirationTime || 'N/A'
      ];
    });

    //Se genera la tabla y se dan estilos a la misma
    autoTable(doc, {
      tableLineColor: [249, 115, 22],
      tableLineWidth: 1.85,
      head: [headers],
      body: body,
      startY: 60,
      theme: 'grid',
      headStyles: {
        fillColor: [23, 33, 48],
        textColor: [249, 115, 22],
        fontStyle: 'bold',
        fontSize: 12,
        halign: 'center',
      },
      bodyStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [55, 65, 81],
      },
    });
    //Pie de página
    let footer = "PassGenerator 2024";
    doc.setFontSize(10);
    const finalY = (doc as any).lastAutoTable.finalY;
    const footerTextWidth = doc.getTextWidth(footer);
    const footerXPos = (pageWidth - footerTextWidth)/2;
    doc.text(footer, footerXPos, finalY + 50);

    //Se guarda el documento
    doc.save(`Passwords_PDF.pdf`);
  }

}
