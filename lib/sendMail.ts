import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Elegant Stores" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback to plain text
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// Newsletter welcome email template
export async function sendNewsletterWelcomeEmail(email: string) {
  const subject = "Welcome to Elegant Stores Newsletter!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #141718;">Welcome to Elegant Stores!</h1>
      <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
      <ul>
        <li>Exclusive product launches</li>
        <li>Special discounts and promotions</li>
        <li>Home decor tips and inspiration</li>
        <li>Latest blog articles</li>
      </ul>
      <p>Stay tuned for our next update!</p>
      <hr style="border: 1px solid #eaeaea; margin: 20px 0;">
      <p style="color: #6C7275; font-size: 12px;">
        You can unsubscribe at any time by clicking the link in our emails.
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

// Order confirmation email template
export async function sendOrderConfirmationEmail(
  email: string,
  orderId: string,
  total: number,
) {
  const subject = `Order Confirmation #${orderId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #141718;">Thank you for your order!</h1>
      <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
      <p>Total: <strong>$${total.toFixed(2)}</strong></p>
      <p>We'll notify you when your order ships.</p>
      <hr style="border: 1px solid #eaeaea; margin: 20px 0;">
      <p style="color: #6C7275; font-size: 12px;">
        If you have any questions, please contact our support team.
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

// Password reset email template
// export async function sendPasswordResetEmail(
//   email: string,
//   resetToken: string,
// ) {
//   const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
//   const subject = "Reset Your Password";
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h1 style="color: #141718;">Reset Your Password</h1>
//       <p>Click the link below to reset your password:</p>
//       <p>
//         <a href="${resetUrl}" style="background-color: #141718; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
//           Reset Password
//         </a>
//       </p>
//       <p>This link will expire in 1 hour.</p>
//       <hr style="border: 1px solid #eaeaea; margin: 20px 0;">
//       <p style="color: #6C7275; font-size: 12px;">
//         If you didn't request a password reset, please ignore this email.
//       </p>
//     </div>
//   `;

//   return sendEmail({ to: email, subject, html });
// }
