import { NextResponse } from 'next/server';
const { uploadPicURI } = require('@/lib/JsonMaker');

export async function POST(req: Request) {
  const { inputCode, uri } = await req.json();
  
  try {
    const metadataUri = await uploadPicURI(inputCode, uri);
    
    if (metadataUri) {
      return NextResponse.json({ 
        success: true, 
        metadataUri: metadataUri,
      });
    } else {
      return NextResponse.json({ 
        success: false, 
      });
    }    
  }
  catch (error) {
    console.error('Error uploading metadata:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message 
    });
  }
}
