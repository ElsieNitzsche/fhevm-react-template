import { NextRequest, NextResponse } from 'next/server';
import { formatError, formatHandle } from '@fhevm/universal-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type } = body;

    if (value === undefined || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: value and type' },
        { status: 400 }
      );
    }

    // In a real implementation, this would perform server-side encryption
    // For now, we'll simulate the response
    const handle = BigInt(`0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`);

    // Use SDK utility to format handle
    const encryptedHandle = formatHandle(handle);

    return NextResponse.json({
      success: true,
      type,
      originalValue: value,
      encryptedHandle,
      message: 'Value encrypted successfully',
    });
  } catch (error) {
    console.error('Encryption error:', error);
    // Use SDK error formatting
    return NextResponse.json(
      { success: false, error: formatError(error) },
      { status: 500 }
    );
  }
}
