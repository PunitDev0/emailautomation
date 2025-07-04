import { connectToDatabase } from '@/DB/db';
import Contact from '@/Models/contactModels';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

// Log environment variables for debugging (remove in production)
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '****' : 'undefined');
console.log('SMTP_FROM:', process.env.SMTP_FROM);

export async function POST(request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse request body
    const { listName, subject, templateId, scheduleDate } = await request.json();

    // Validate required fields
    if (!listName || !subject || !templateId) {
      return NextResponse.json(
        { message: 'List name, subject, and template are required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
      return NextResponse.json(
        { message: 'SMTP configuration missing in environment variables' },
        { status: 500 }
      );
    }

    // Fetch contacts for the selected list
    const contacts = await Contact.find({ listName }).lean();

    if (!contacts.length) {
      return NextResponse.json(
        { message: 'No contacts found in the selected list' },
        { status: 400 }
      );
    }

    // Mock template content (replace with real template fetching logic if needed)
    const templates = {
      '1': {
        subject: subject || 'Welcome to {{company}}!',
        body: 'Hello {{name}},\n\nWelcome to {{company}}! We\'re excited to have you on board.\n\nBest regards,\nThe Team',
      },
      '2': {
        subject: subject || 'Exciting News: New Product Launch!',
        body: 'Hello {{name}},\n\nWe\'re thrilled to announce our new product launch!\n\nBest regards,\nThe Team',
      },
      '3': {
        subject: subject || 'Monthly Newsletter - {{company}}',
        body: 'Hello {{name}},\n\nHere\'s your monthly newsletter from {{company}}.\n\nBest regards,\nThe Team',
      },
    };

    const template = templates[templateId];
    if (!template) {
      return NextResponse.json(
        { message: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Configure Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // Use SSL for port 465
      secureConnection:false,
      requireTLS:true,
      tls:{
         ciphers:"SSLv3"
        },
        debug: true, // Show debug output
      auth: {
        user: process.env.SMTP_USER, // e.g., info@socialsynk.in
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP Server is ready to take messages');
    } catch (error) {
      console.error('SMTP Verification Failed:', error);
      return NextResponse.json(
        { message: 'SMTP configuration error', error: error.message },
        { status: 500 }
      );
    }

    let sent = 0;
    let failed = 0;
    const failedEmails = [];

    // Send emails to each contact
    for (const contact of contacts) {
      try {
        const personalizedBody = template.body
          .replace('{{name}}', contact.name || 'User')
          .replace('{{company}}', contact.company || 'Our Company');

        const personalizedSubject = subject
          .replace('{{company}}', contact.company || 'Our Company');

        await transporter.sendMail({
          from: process.env.SMTP_FROM, // e.g., info@socialsynk.in
          to: contact.email,
          subject: personalizedSubject,
          text: personalizedBody,
        });

        sent++;
        console.log(`Email sent to ${contact.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${contact.email}:`, error);
        failed++;
        failedEmails.push({ email: contact.email, error: error.message });
      }
    }

    // If scheduled, return scheduled response (simplified; real scheduling needs a queue system)
    if (scheduleDate) {
      return NextResponse.json({
        message: 'Email campaign scheduled',
        scheduledFor: scheduleDate,
        listName,
      });
    }

    // Return campaign results
    return NextResponse.json({
      message: 'Email campaign completed',
      sent,
      failed,
      failedEmails, // Include details of failed emails for debugging
      listName,
    });
  } catch (error) {
    console.error('Error in email campaign:', error);
    return NextResponse.json(
      { message: 'Error sending emails', error: error.message },
      { status: 500 }
    );
  }
}