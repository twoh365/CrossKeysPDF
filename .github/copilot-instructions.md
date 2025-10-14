# CrossKeysPDF - AI Agent Instructions

## Project Overview
CrossKeysPDF is a multi-property hospitality invoice generation system with three main components:
- `index.html` - Property selection landing page
- `crosskeys.html` - Crosskeys invoice generator (CK branding)  
- `armadillo.html` - Armadillo Guest House invoice generator (AG branding)

## Architecture & Patterns

### Single-File Applications
Each property has a **complete standalone HTML file** containing:
- Embedded CSS with CSS custom properties for theming
- Inline JavaScript for all functionality
- No external dependencies except `html2pdf.js` CDN

### Dual-Mode Invoice Logic
Both generators support two calculation modes:
```javascript
// Flat rate: either "rate per night" or "total for stay" 
if (flatInputMode === 'rate') { amounts = Array(nights.length).fill(val); }
else { amounts = splitEvenly(val, nights.length); }

// Custom nightly: individual rates per night
rows.forEach(tr => {
  const r = parseFloat(tr.querySelector('.night-rate').value || "0");
  // ... build invoice line by line
});
```

### Shared Code Patterns
Key functions duplicated across both files:
- `fmtGBP()` - UK currency formatting using Intl.NumberFormat
- `formatDatePretty()` - "1st of January 2024" style dates with ordinals
- `listNights()` - Generate array of ISO dates between check-in/out
- `splitEvenly()` - Distribute total amount across nights (handles penny rounding)

### Branding System
Property-specific elements:
- **Watermarks**: CSS `::before` pseudoelements with monograms ("CK" vs "AG")
- **Color scheme**: Consistent `--cream`, `--ink`, `--line` custom properties
- **Logo handling**: Crosskeys uses placeholder, Armadillo uses external image URL
- **File naming**: PDFs auto-name as `Crosskeys-Invoice.pdf` vs `ArmadilloGuestHouse-Invoice.pdf`

### VAT Implementation  
Three VAT modes with conditional UI display:
```javascript
if (vatOption === 'excluded') { 
  vat = subtotal * 0.20; 
  total = subtotal + vat; 
  document.getElementById('vatRow').style.display = 'table-row'; 
}
else if (vatOption === 'included') { 
  document.getElementById('vatNote').style.display = 'block'; 
}
```

## Key Development Workflows

### Testing Invoice Generation
1. Open property HTML file directly in browser
2. Fill form fields (dates auto-populate to today)
3. Use "Preview on Page" before "Download PDF" 
4. Check both flat and custom rate modes
5. Verify VAT calculations and display logic

### Adding New Properties
1. Copy existing property HTML file
2. Update branding elements: title, watermark monogram, logo, footer text
3. Modify CSS custom properties if different color scheme needed
4. Update PDF filename in `generateInvoice()` function
5. Add new property card to `index.html`

### Styling Changes
- A4 dimensions: `#invoice` is exactly `210mm × 297mm` with `18mm 16mm` padding
- Print-specific CSS: Uses `print-color-adjust: exact` for PDF generation
- Watermark positioning: Large background monogram with `opacity: .03`

## External Dependencies
- **html2pdf.js**: Only external dependency, loaded from CDNJS
- **Tesseract files**: OCR capability in `/tesseract/` (unused in current implementation)
- **Font system**: Uses system font stack, serif fonts for headers/branding

## Critical Implementation Details
- Date inputs use ISO format but display as UK format (DD/MM/YYYY)
- Currency always GBP with proper British formatting
- PDF generation has fallback blob download if direct save fails
- Default payment method: "Paid by Card Via Booking.com."
- Invoice dates default to current date on page load