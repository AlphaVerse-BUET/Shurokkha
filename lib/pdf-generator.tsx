/**
 * PDF Generation for Donation Receipts
 * Generates downloadable PDF receipts with QR codes
 */

export interface ReceiptData {
  donorName: string
  donorEmail: string
  donationId: string
  amount: number
  date: Date
  crisisName: string
  providerName: string
  beneficiaries: Array<{
    name: string
    location: string
    amount: number
  }>
  status: string
  transactionId: string
}

export async function generateReceipt(data: ReceiptData): Promise<string> {
  // Mock PDF generation - returns a data URL
  // In production, this would use jsPDF or similar library

  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Create a simple HTML representation that could be converted to PDF
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
        .logo { font-size: 32px; font-weight: bold; color: #10b981; }
        .receipt-info { margin: 30px 0; }
        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { font-weight: bold; }
        .beneficiaries { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
        .qr-code { text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SHUROKKHA</div>
        <p>Transparent Donation Platform</p>
        <h2>Donation Receipt</h2>
      </div>
      
      <div class="receipt-info">
        <div class="info-row">
          <span class="label">Receipt ID:</span>
          <span>${data.donationId}</span>
        </div>
        <div class="info-row">
          <span class="label">Date:</span>
          <span>${data.date.toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <span class="label">Donor Name:</span>
          <span>${data.donorName}</span>
        </div>
        <div class="info-row">
          <span class="label">Email:</span>
          <span>${data.donorEmail}</span>
        </div>
        <div class="info-row">
          <span class="label">Amount:</span>
          <span>৳${data.amount.toLocaleString()}</span>
        </div>
        <div class="info-row">
          <span class="label">Crisis:</span>
          <span>${data.crisisName}</span>
        </div>
        <div class="info-row">
          <span class="label">Provider:</span>
          <span>${data.providerName}</span>
        </div>
        <div class="info-row">
          <span class="label">Status:</span>
          <span>${data.status}</span>
        </div>
        <div class="info-row">
          <span class="label">Transaction ID:</span>
          <span>${data.transactionId}</span>
        </div>
      </div>
      
      <div class="beneficiaries">
        <h3>Beneficiaries Helped</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.beneficiaries
              .map(
                (b) => `
              <tr>
                <td>${b.name}</td>
                <td>${b.location}</td>
                <td>৳${b.amount.toLocaleString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      
      <div class="qr-code">
        <p>Scan to verify this receipt:</p>
        <div style="width: 150px; height: 150px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          QR Code: ${data.donationId}
        </div>
      </div>
      
      <div class="footer">
        <p>This is an official receipt from Shurokkha Platform</p>
        <p>For verification, visit: shurokkha.org/verify/${data.donationId}</p>
        <p>Thank you for your generous contribution!</p>
      </div>
    </body>
    </html>
  `

  // In a real implementation, convert HTML to PDF using jsPDF or similar
  // For now, return a mock data URL
  return `data:application/pdf;base64,${btoa(receiptHTML)}`
}

export function downloadReceipt(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
