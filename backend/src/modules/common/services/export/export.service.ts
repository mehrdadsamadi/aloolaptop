// src/modules/export/export.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';

// استفاده از require برای exceljs
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { stringify } = require('csv-stringify/sync');

export interface ExportOptions {
  filename?: string;
  title?: string;
  columns: ExportColumn[];
  fontPath?: string; // مسیر فایل فونت فارسی (اختیاری)
}

export interface ExportColumn {
  key: string;
  title: string;
  width?: number;
  format?: (value: any, row?: any) => string | number;
}

export enum ExportFormats {
  EXCEL = 'excel',
  CSV = 'csv',
  PDF = 'pdf',
}

@Injectable()
export class ExportService {
  // مسیر پیش‌فرض فونت فارسی
  private defaultFontPath = join(
    process.cwd(),
    'public',
    'fonts',
    'vazirmatn.ttf',
  );

  /* ========================= EXCEL ========================= */
  async toExcel<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions,
  ): Promise<Buffer> {
    try {
      if (!ExcelJS?.Workbook) {
        throw new Error('ExcelJS module is not properly loaded');
      }

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Admin Panel';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet(options.title ?? 'Report');

      // تعریف ستون‌ها
      sheet.columns = options.columns.map((col) => ({
        header: col.title,
        key: col.key,
        width: col.width ?? 22,
      }));

      // اضافه کردن داده‌ها
      data.forEach((row) => {
        const record: Record<string, any> = {};

        for (const col of options.columns) {
          const value = this.getNestedValue(row, col.key);
          record[col.key] = col.format ? col.format(value, row) : value;
        }

        sheet.addRow(record);
      });

      // استایل هدر
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center' };

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      console.error('Error in toExcel:', error);
      throw error;
    }
  }

  /* ========================= CSV ========================= */
  async toCSV<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions,
  ): Promise<Buffer> {
    try {
      const records = data.map((row) =>
        options.columns.map((col) => {
          const value = this.getNestedValue(row, col.key);
          return col.format ? col.format(value, row) : value;
        }),
      );

      const csv = stringify(records, {
        header: true,
        columns: options.columns.map((c) => c.title),
        quoted: true,
      });

      return Buffer.from(csv, 'utf8');
    } catch (error) {
      console.error('Error in toCSV:', error);
      throw error;
    }
  }

  /* ========================= PDF ========================= */
  async toPDF<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // ایجاد document
        const doc = new PDFDocument({
          margin: 40,
          size: 'A4',
          layout: 'portrait',
          autoFirstPage: true,
        });

        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // بارگذاری فونت فارسی
        let fontLoaded = false;
        try {
          const fontPath = options.fontPath || this.defaultFontPath;
          console.log('Font path:', fontPath);

          // بررسی وجود فایل فونت
          const fs = require('fs');
          if (fs.existsSync(fontPath)) {
            const fontBuffer = readFileSync(fontPath);
            doc.registerFont('Vazir', fontBuffer);
            doc.font('Vazir');
            fontLoaded = true;
            console.log('✅ فونت فارسی با موفقیت بارگذاری شد');
          } else {
            console.warn('❌ فایل فونت در مسیر یافت نشد:', fontPath);
            doc.font('Helvetica');
          }
        } catch (fontError) {
          console.warn('⚠️ خطا در بارگذاری فونت فارسی:', fontError.message);
          doc.font('Helvetica');
        }

        // عنوان
        if (options.title) {
          doc.fontSize(18).text(options.title, { align: 'center' });
          doc.moveDown();
        }

        doc.fontSize(10);

        // تنظیمات جدول
        const startX = 40;
        const pageWidth = 595.28;
        const endX = pageWidth - 40;
        const tableWidth = endX - startX;
        const colCount = Math.min(options.columns.length, 5); // حداکثر 5 ستون برای خوانایی
        const colWidth = tableWidth / colCount;

        let yPosition = doc.y;

        // فقط اگر تعداد ستون‌ها قابل مدیریت باشد
        if (options.columns.length > 5) {
          console.warn(
            'تعداد ستون‌ها زیاد است، فقط 5 ستون اول نمایش داده می‌شود',
          );
        }

        // هدر جدول
        const columnsToShow = options.columns.slice(0, colCount);

        doc.rect(startX, yPosition - 5, tableWidth, 25).fill('#f0f0f0');

        columnsToShow.forEach((col, index) => {
          doc
            .fillColor('#000')
            .fontSize(11)
            .font(fontLoaded ? 'Vazir' : 'Helvetica-Bold')
            .text(col.title, startX + index * colWidth + 5, yPosition, {
              width: colWidth - 10,
              align: 'right', // برای فارسی همیشه راست‌چین
            });
        });

        yPosition += 25;

        // خط جداکننده هدر
        doc
          .moveTo(startX, yPosition)
          .lineTo(endX, yPosition)
          .strokeColor('#333')
          .stroke();

        yPosition += 5;

        // داده‌ها
        data.forEach((row, rowIndex) => {
          // بررسی اگر به انتهای صفحه رسیدیم
          if (yPosition > 750) {
            doc.addPage();
            yPosition = 40;

            // اضافه کردن هدر در صفحه جدید
            doc.rect(startX, yPosition - 5, tableWidth, 25).fill('#f0f0f0');
            columnsToShow.forEach((col, index) => {
              doc
                .fillColor('#000')
                .fontSize(11)
                .font(fontLoaded ? 'Vazir' : 'Helvetica-Bold')
                .text(col.title, startX + index * colWidth + 5, yPosition, {
                  width: colWidth - 10,
                  align: 'right',
                });
            });
            yPosition += 25;
            doc
              .moveTo(startX, yPosition)
              .lineTo(endX, yPosition)
              .strokeColor('#333')
              .stroke();
            yPosition += 5;
          }

          // رنگ پس‌زمینه متناوب
          if (rowIndex % 2 === 0) {
            doc.rect(startX, yPosition, tableWidth, 20).fill('#f9f9f9');
          }

          // چاپ مقادیر
          let maxRowHeight = 20;
          columnsToShow.forEach((col, colIndex) => {
            const value = this.getNestedValue(row, col.key);
            const formatted = col.format
              ? col.format(value, row)
              : (value ?? '');

            const text = String(formatted);

            // محاسبه ارتفاع متن
            const textHeight = doc.heightOfString(text, {
              width: colWidth - 10,
              align: 'right',
            });
            maxRowHeight = Math.max(maxRowHeight, textHeight);

            doc
              .fillColor('#000')
              .fontSize(10)
              .font(fontLoaded ? 'Vazir' : 'Helvetica')
              .text(text, startX + colIndex * colWidth + 5, yPosition, {
                width: colWidth - 10,
                align: 'right',
              });
          });

          // خط جداکننده ردیف
          doc
            .moveTo(startX, yPosition + maxRowHeight + 2)
            .lineTo(endX, yPosition + maxRowHeight + 2)
            .strokeColor('#ddd')
            .stroke();

          yPosition += maxRowHeight + 5;
        });

        // پاورقی
        const totalPages = doc.bufferedPageRange
          ? doc.bufferedPageRange().count
          : 1;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          const footerY = 820; // موقعیت ثابت برای پاورقی

          doc
            .fontSize(8)
            .fillColor('#666')
            .font(fontLoaded ? 'Vazir' : 'Helvetica')
            .text(
              `صفحه ${i + 1} از ${totalPages} | ${new Date().toLocaleDateString('fa-IR')}`,
              startX,
              footerY,
              { width: tableWidth, align: 'center' },
            );
        }

        doc.end();
      } catch (error) {
        console.error('Error in toPDF:', error);
        reject(error);
      }
    });
  }

  /* ========================= MAIN EXPORT ========================= */
  async export<T extends Record<string, any>>(
    data: T[],
    format: ExportFormats,
    options: ExportOptions,
  ): Promise<{ buffer: Buffer; filename: string }> {
    try {
      const baseName = options.filename ?? `export-${Date.now()}`;
      let buffer: Buffer;

      switch (format) {
        case ExportFormats.EXCEL:
          buffer = await this.toExcel(data, options);
          return { buffer, filename: `${baseName}.xlsx` };

        case ExportFormats.CSV:
          buffer = await this.toCSV(data, options);
          return { buffer, filename: `${baseName}.csv` };

        case ExportFormats.PDF:
          buffer = await this.toPDF(data, options);
          return { buffer, filename: `${baseName}.pdf` };

        default:
          throw new Error(`فرمت ${format} پشتیبانی نمی‌شود`);
      }
    } catch (error) {
      console.error('Error in export method:', error);
      throw error;
    }
  }

  /* ========================= UTILS ========================= */
  private getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;

    return path.split('.').reduce((acc, key) => {
      if (acc === null || acc === undefined) return undefined;
      return acc[key];
    }, obj);
  }

  // تشخیص متن RTL (فارسی، عربی و ...)
  private isRTL(text: string): boolean {
    if (!text) return false;

    const rtlRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text);
  }
}
