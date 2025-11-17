//
// Utilities for exporting DOM content to PNG and PDF using client-side libraries.
// Depends on 'html-to-image' and 'jspdf' packages. Frontend-only; no backend calls.
//

import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

/**
 * PUBLIC_INTERFACE
 * downloadDataUrl
 * Trigger a browser download for a given data URL and filename.
 * @param {string} dataUrl - Data URL (e.g., image/png or application/pdf)
 * @param {string} filename - Filename to save as
 */
export function downloadDataUrl(dataUrl, filename) {
  /** Initiates a client-side download using an anchor element. */
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  requestAnimationFrame(() => {
    document.body.removeChild(link);
  });
}

/**
 * PUBLIC_INTERFACE
 * exportNodeToPng
 * Convert a DOM node to a PNG image (Data URL) and optionally trigger download.
 * @param {HTMLElement} node - DOM element to export
 * @param {object} [options]
 * @param {string} [options.filename] - If provided, triggers a download
 * @param {number} [options.pixelRatio=2] - Device pixel ratio multiplier for crispness
 * @returns {Promise<string>} - Resolves with the PNG data URL
 */
export async function exportNodeToPng(node, { filename, pixelRatio = 2 } = {}) {
  if (!node) throw new Error('exportNodeToPng: node is required');
  const dataUrl = await toPng(node, {
    pixelRatio,
    cacheBust: true,
    // Ensure fonts/colors render as expected on white background
    backgroundColor: '#FFFFFF',
  });
  if (filename) {
    downloadDataUrl(dataUrl, filename);
  }
  return dataUrl;
}

/**
 * PUBLIC_INTERFACE
 * exportNodeToPdf
 * Render a DOM node to a single-page PDF by first converting to PNG and then embedding into jsPDF.
 * @param {HTMLElement} node - DOM element to export
 * @param {object} [options]
 * @param {string} [options.filename='certificate.pdf'] - Filename for download
 * @param {'portrait'|'landscape'} [options.orientation='landscape'] - Page orientation
 * @param {'a4'|'letter'} [options.pageSize='a4'] - Paper size
 * @param {number} [options.pixelRatio=2] - Render scaling for the PNG
 * @returns {Promise<void>}
 */
export async function exportNodeToPdf(
  node,
  { filename = 'certificate.pdf', orientation = 'landscape', pageSize = 'a4', pixelRatio = 2 } = {}
) {
  if (!node) throw new Error('exportNodeToPdf: node is required');

  // Convert node to image
  const imgData = await exportNodeToPng(node, { pixelRatio });

  // Create PDF and calculate image dimensions to fit the page with margins
  const pdf = new jsPDF({ orientation, unit: 'pt', format: pageSize });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Load image to get natural size
  const tmpImg = new Image();
  const loadPromise = new Promise((resolve, reject) => {
    tmpImg.onload = resolve;
    tmpImg.onerror = reject;
  });
  tmpImg.src = imgData;
  await loadPromise;

  const imgW = tmpImg.naturalWidth;
  const imgH = tmpImg.naturalHeight;

  // Fit image while preserving aspect ratio; leave small margin
  const margin = 24;
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;

  const scale = Math.min(maxW / imgW, maxH / imgH);
  const renderW = imgW * scale;
  const renderH = imgH * scale;
  const x = (pageWidth - renderW) / 2;
  const y = (pageHeight - renderH) / 2;

  pdf.addImage(imgData, 'PNG', x, y, renderW, renderH);
  pdf.save(filename);
}
