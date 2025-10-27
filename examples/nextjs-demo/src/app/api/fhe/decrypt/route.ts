import { NextRequest, NextResponse } from 'next/server';
import { formatError, isValidAddress, parseHandle } from '@fhevm/universal-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handle, contractAddress, signature } = body;

    if (!handle || !contractAddress || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: handle, contractAddress, and signature'
        },
        { status: 400 }
      );
    }

    // Use SDK validation utility
    if (!isValidAddress(contractAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid contract address' },
        { status: 400 }
      );
    }

    // Parse handle using SDK utility
    const parsedHandle = parseHandle(handle);

    // In a real implementation, this would:
    // 1. Verify the EIP-712 signature
    // 2. Check permissions in the ACL contract
    // 3. Request decryption from the KMS/Gateway
    // 4. Return the decrypted value

    // Simulated decrypted value
    const decryptedValue = Math.floor(Math.random() * 100);

    return NextResponse.json({
      success: true,
      handle,
      parsedHandle: parsedHandle.toString(),
      decryptedValue,
      message: 'Value decrypted successfully',
    });
  } catch (error) {
    console.error('Decryption error:', error);
    // Use SDK error formatting
    return NextResponse.json(
      { success: false, error: formatError(error) },
      { status: 500 }
    );
  }
}
