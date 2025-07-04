import { connectToDatabase } from '@/DB/db'
import Contact from '@/Models/contactModels';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectToDatabase();

    const { contacts, listName } = await request.json();

    if (!listName || !listName.trim()) {
      return NextResponse.json(
        { message: 'List name is required' },
        { status: 400 }
      );
    }

    // Ensure each contact has a name and listName
    const formattedContacts = contacts.map(contact => ({
      ...contact,
      name: contact.name && contact.name.trim() ? contact.name : 'Unknown',
      email: contact.email || '',
      company: contact.company || '',
      custom1: contact.custom1 || '',
      custom2: contact.custom2 || '',
      listName: listName.trim(),
    }));

    // Insert contacts into MongoDB
    const result = await Contact.insertMany(formattedContacts, { ordered: false });

    return NextResponse.json({
      message: 'Contacts saved successfully',
      count: result.length,
      listName,
    });
  } catch (error) {
    console.error('Error saving contacts:', error);
    return NextResponse.json(
      { message: 'Error saving contacts', error: error.message },
      { status: 500 }
    );
  }
}