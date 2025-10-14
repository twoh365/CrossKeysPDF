const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const {
            guestEmail,
            guestName,
            propertyName,
            pdfBase64,
            fileName
        } = JSON.parse(event.body);

        // Validate required fields
        if (!guestEmail || !guestName || !propertyName || !pdfBase64 || !fileName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Create transporter - supports multiple email providers
        // Set EMAIL_SERVICE environment variable to choose provider
        const emailService = process.env.EMAIL_SERVICE || 'gmail';

        let transporterConfig;

        if (emailService === 'gmail') {
            transporterConfig = {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD // Gmail App Password
                }
            };
        } else if (emailService === 'outlook') {
            transporterConfig = {
                service: 'hotmail', // Works for outlook.com too
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD // Regular password or App Password
                }
            };
        } else if (emailService === 'yahoo') {
            transporterConfig = {
                service: 'yahoo',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD // Yahoo App Password required
                }
            };
        } else if (emailService === 'custom') {
            // For other providers like ProtonMail, custom SMTP, etc.
            transporterConfig = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            };
        }

        const transporter = nodemailer.createTransporter(transporterConfig);

        // Email content
        const mailOptions = {
            from: `"${propertyName}" <${process.env.EMAIL_USER}>`,
            to: guestEmail,
            subject: `Invoice from ${propertyName} - ${guestName}`,
            text: `Dear ${guestName},

Please find your invoice attached for your stay at ${propertyName}.

Thank you for choosing ${propertyName}.

Best regards,
The ${propertyName} Team

---
Invoice generated on: ${new Date().toLocaleDateString('en-GB')}`,

            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #333;">Invoice from ${propertyName}</h2>
          <p>Dear ${guestName},</p>
          <p>Please find your invoice attached for your stay at ${propertyName}.</p>
          <p>Thank you for choosing ${propertyName}.</p>
          <br>
          <p>Best regards,<br>
          The ${propertyName} Team</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <small style="color: #666;">Invoice generated on: ${new Date().toLocaleDateString('en-GB')}</small>
        </div>
      `,

            attachments: [{
                filename: fileName,
                content: pdfBase64,
                encoding: 'base64'
            }]
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                success: true,
                message: `Invoice successfully sent to ${guestEmail}`
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST'
            },
            body: JSON.stringify({
                error: 'Failed to send email',
                details: error.message
            })
        };
    }
};