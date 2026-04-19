import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendMail";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Send email to admin (you)
    const adminEmail = process.env.EMAIL_USER;
    if (!adminEmail) {
      return NextResponse.json(
        { error: "Email configuration error" },
        { status: 500 },
      );
    }

    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #141718;">New Contact Form Submission</h1>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #141718;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="color: #6C7275; font-size: 12px;">
          Received at: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `Contact Form: ${subject}`,
      html: adminEmailHtml,
    });

    if (!adminResult.success) {
      console.error("Failed to send admin email:", adminResult.error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 },
      );
    }

    // Send confirmation email to user
    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #141718;">Thank you for contacting Elegant Stores!</h1>
        <p>We've received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #141718; margin-top: 0;">Your Message Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #141718;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        
        <p>Our team typically responds within 24-48 hours.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="color: #6C7275; font-size: 12px;">
            This is an automated confirmation. Please do not reply to this email.<br>
            If you need to update your message, please submit a new contact form.
          </p>
        </div>
      </div>
    `;

    const userResult = await sendEmail({
      to: email,
      subject: "We've received your message - Elegant Stores",
      html: userConfirmationHtml,
    });

    if (!userResult.success) {
      console.error("Failed to send user confirmation:", userResult.error);
      // Don't fail the whole request if user email fails, just log it
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      adminEmailSent: adminResult.success,
      userConfirmationSent: userResult.success,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
