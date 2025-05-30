import { NextResponse } from 'next/server';

const { run } = require('@/lib/plateGen');

export async function POST(req: Request) {
  const { letters, numbers } = await req.json();

  try {
    const imageUri = await run(letters, numbers);
    
    if (imageUri) {
      return NextResponse.json({ 
        success: true, 
        imageUri: imageUri,
      });
    } else {
      return NextResponse.json({ 
        success: false, 
      });
    }    
  }
  catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message 
    });
  }
}
