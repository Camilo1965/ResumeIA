import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { databaseClient } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  let requestBody;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const { fullName, emailAddress, userPassword, confirmPassword } = requestBody;

  // Validate full name
  if (!fullName || fullName.trim().length === 0) {
    return NextResponse.json(
      { success: false, message: 'Full name is required' },
      { status: 400 }
    );
  }

  // Validate email address
  if (!emailAddress || emailAddress.trim().length === 0) {
    return NextResponse.json(
      { success: false, message: 'Email address is required' },
      { status: 400 }
    );
  }

  const atSymbolPosition = emailAddress.indexOf('@');
  if (atSymbolPosition <= 0 || atSymbolPosition >= emailAddress.length - 1) {
    return NextResponse.json(
      { success: false, message: 'Email address format is invalid' },
      { status: 400 }
    );
  }

  const domainSection = emailAddress.substring(atSymbolPosition + 1);
  const dotPosition = domainSection.indexOf('.');
  if (dotPosition <= 0 || dotPosition >= domainSection.length - 1) {
    return NextResponse.json(
      { success: false, message: 'Email domain is invalid' },
      { status: 400 }
    );
  }

  // Validate password
  if (!userPassword || userPassword.length < 8) {
    return NextResponse.json(
      { success: false, message: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Validate password confirmation
  if (userPassword !== confirmPassword) {
    return NextResponse.json(
      { success: false, message: 'Passwords do not match' },
      { status: 400 }
    );
  }

  try {
    if (!databaseClient) {
      return NextResponse.json(
        { success: false, message: 'Database service unavailable' },
        { status: 503 }
      );
    }

    // Check if email already exists
    const existingUser = await databaseClient.authenticatedUser.findUnique({
      where: { emailAddress },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email address already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userPassword, 12);

    // Create user
    const createdUser = await databaseClient.authenticatedUser.create({
      data: {
        fullName,
        emailAddress,
        hashedPassword: passwordHash,
      },
      select: {
        userId: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId: createdUser.userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('User registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
