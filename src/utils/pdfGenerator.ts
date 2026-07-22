import { jsPDF } from 'jspdf';
import { EventData } from '../types';

export const generateEventPDF = (event: EventData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions: A4 is 210mm x 297mm
  const pageWidth = 210;
  const marginX = 20;
  let currentY = 20;

  const formatCurrency = (val: number) => {
    return 'S/. ' + val.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // --- 1. HEADER BRANDING ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IDILIO MUSIC', marginX, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('REPORTE OFICIAL DE CONTROL DE LIQUIDACIÓN', marginX, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`FECHA: ${event.date}`, pageWidth - marginX, 15, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('DOCUMENTO DIGITAL', pageWidth - marginX, 22, { align: 'right' });

  // Move down past header
  currentY = 48;

  // --- 2. EVENT SUMMARY BANNER ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(marginX, currentY, pageWidth - 2 * marginX, 24, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('EVENTO / PRESENTACIÓN', marginX + 6, currentY + 8);

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(event.name, marginX + 6, currentY + 16);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INGRESO TOTAL BRUTO', pageWidth - marginX - 6, currentY + 8, { align: 'right' });

  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(formatCurrency(event.balance), pageWidth - marginX - 6, currentY + 16, { align: 'right' });

  currentY += 34;

  // --- 3. SECTION 1: DEDUCCIONES FIJAS ---
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. DEDUCCIONES FIJAS (PAGOS A MÚSICOS Y MOVILIDAD)', marginX, currentY);
  
  // Section underline
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
  currentY += 6;

  // Table header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(marginX, currentY, pageWidth - 2 * marginX, 7, 'F');
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('INTEGRANTE / CONCEPTO', marginX + 4, currentY + 5);
  doc.text('MONTO RECIBIDO', pageWidth - marginX - 4, currentY + 5, { align: 'right' });
  currentY += 7;

  // Deduction Items
  const d = event.deductions;
  const fixedItems = [
    { name: 'Berly', amount: d.berly },
    { name: 'Myki', amount: d.myki },
    { name: 'Wili', amount: d.wili },
    { name: 'Gustavo', amount: d.gustavo },
    { name: 'Animación', amount: d.animacion },
    { name: 'Bajo', amount: d.bajo },
    { name: 'Movilidad', amount: d.movilidad },
  ];

  let deductionsTotal = 0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  fixedItems.forEach((item) => {
    deductionsTotal += item.amount;
    
    // Draw row bottom border line
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, currentY + 6, pageWidth - marginX, currentY + 6);
    
    doc.text(item.name, marginX + 4, currentY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(item.amount), pageWidth - marginX - 4, currentY + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    
    currentY += 6.5;
  });

  // Subtotal Row
  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, currentY, pageWidth - 2 * marginX, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal Deducciones Fijas', marginX + 4, currentY + 4.5);
  doc.text(formatCurrency(deductionsTotal), pageWidth - marginX - 4, currentY + 4.5, { align: 'right' });
  
  currentY += 15;

  // --- 4. SECTION 2: GASTOS EXTRA Y VIÁTICOS ---
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. DETALLE DE GASTOS EXTRA Y VIÁTICOS', marginX, currentY);
  
  doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
  currentY += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, pageWidth - 2 * marginX, 7, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('FECHA', marginX + 4, currentY + 5);
  doc.text('DESCRIPCIÓN', marginX + 22, currentY + 5);
  doc.text('CATEGORÍA', marginX + 90, currentY + 5);
  doc.text('MONTO', pageWidth - marginX - 4, currentY + 5, { align: 'right' });
  currentY += 7;

  let additionalExpensesTotal = 0;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  // Viáticos fixed item if present
  if (d.viaticos > 0) {
    additionalExpensesTotal += d.viaticos;
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, currentY + 6, pageWidth - marginX, currentY + 6);

    doc.text('20 jul', marginX + 4, currentY + 4);
    doc.text('Viáticos (Fijo)', marginX + 22, currentY + 4);
    doc.setTextColor(100, 116, 139);
    doc.text('VIÁTICOS', marginX + 90, currentY + 4);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(d.viaticos), pageWidth - marginX - 4, currentY + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    currentY += 6.5;
  }

  // User-added additional expenses
  if (event.additionalExpenses.length > 0) {
    event.additionalExpenses.forEach((exp) => {
      additionalExpensesTotal += exp.amount;
      doc.setDrawColor(241, 245, 249);
      doc.line(marginX, currentY + 6, pageWidth - marginX, currentY + 6);

      doc.text(exp.date || '20 jul', marginX + 4, currentY + 4);
      doc.text(exp.description, marginX + 22, currentY + 4);
      doc.setTextColor(100, 116, 139);
      doc.text(exp.category, marginX + 90, currentY + 4);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(exp.amount), pageWidth - marginX - 4, currentY + 4, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      currentY += 6.5;
    });
  } else if (d.viaticos === 0) {
    doc.setDrawColor(241, 245, 249);
    doc.line(marginX, currentY + 8, pageWidth - marginX, currentY + 8);
    doc.setTextColor(148, 163, 184);
    doc.text('No hay gastos adicionales registrados en este evento.', marginX + 4, currentY + 5);
    doc.setTextColor(15, 23, 42);
    currentY += 8;
  }

  // Subtotal Extra Expenses Row
  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, currentY, pageWidth - 2 * marginX, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal Gastos y Viáticos Extra', marginX + 4, currentY + 4.5);
  doc.text(formatCurrency(additionalExpensesTotal), pageWidth - marginX - 4, currentY + 4.5, { align: 'right' });
  
  currentY += 15;

  // --- 5. SECTION 3: RESUMEN DE CIERRE Y TOTALES ---
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. RESUMEN DE CIERRE DE CAJA', marginX, currentY);
  
  doc.line(marginX, currentY + 2, pageWidth - marginX, currentY + 2);
  currentY += 6;

  const totalExpenses = deductionsTotal + additionalExpensesTotal;
  const netProfit = event.balance - totalExpenses;

  // Grid / Layout box for final totals
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, currentY, pageWidth - 2 * marginX, 32, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  
  // Row 1: Presentation Revenue
  doc.setFont('helvetica', 'normal');
  doc.text('Saldo de Presentación (Ingreso Bruto)', marginX + 6, currentY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatCurrency(event.balance), pageWidth - marginX - 6, currentY + 7, { align: 'right' });

  // Row 2: Total Deductions & Extra Expenses
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('(-) Deducciones Fijas', marginX + 6, currentY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text(`- ${formatCurrency(deductionsTotal)}`, pageWidth - marginX - 6, currentY + 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('(-) Gastos Extra y Viáticos', marginX + 6, currentY + 19);
  doc.setFont('helvetica', 'bold');
  doc.text(`- ${formatCurrency(additionalExpensesTotal)}`, pageWidth - marginX - 6, currentY + 19, { align: 'right' });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX + 4, currentY + 22, pageWidth - marginX - 4, currentY + 22);

  // Row 3: Total Expenses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL EGRESOS / GASTOS DE EVENTO', marginX + 6, currentY + 27);
  doc.text(formatCurrency(totalExpenses), pageWidth - marginX - 6, currentY + 27, { align: 'right' });

  currentY += 32;

  // NET PROFIT BIG BANNER
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(marginX, currentY + 2, pageWidth - 2 * marginX, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SALDO NETO REMANENTE EN CAJA', marginX + 6, currentY + 9.5);
  doc.setFontSize(11);
  doc.text(formatCurrency(netProfit), pageWidth - marginX - 6, currentY + 9.5, { align: 'right' });

  currentY += 32;

  // --- 6. SIGNATURE BLOCK ---
  // Ensure we are not too close to the bottom of the page, A4 is 297mm
  if (currentY > 240) {
    doc.addPage();
    currentY = 30;
  }

  const sigY = currentY + 15;
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.4);

  // Signature 1
  doc.line(marginX + 10, sigY, marginX + 65, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Representante / Director', marginX + 37.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('IDILIO MUSIC', marginX + 37.5, sigY + 9, { align: 'center' });

  // Signature 2
  doc.line(pageWidth - marginX - 65, sigY, pageWidth - marginX - 10, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Tesorero / Conformidad', pageWidth - marginX - 37.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('FIRMA DE RECIBIDO', pageWidth - marginX - 37.5, sigY + 9, { align: 'center' });

  // Save the document
  const fileName = `Liquidacion_${event.name.replace(/\s+/g, '_')}_${event.date.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
