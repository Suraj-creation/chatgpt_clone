import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/lib/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('⚠️ GEMINI_API_KEY is not set in environment variables');
}

interface RequestBody {
  messages: Message[];
  model: string;
  systemPrompt?: string;
}

/**
 * Convert messages to Gemini API format
 */
function convertToGeminiFormat(messages: Message[], systemPrompt?: string) {
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  // Prepend system prompt as first user message if provided
  if (systemPrompt && contents.length > 0 && contents[0].role === 'user') {
    contents[0] = {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\n${contents[0].parts[0].text}` }],
    };
  }

  return contents;
}

/**
 * Test API key by making a simple request
 */
async function testApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const testUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hi' }] }]
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `API key test failed: ${response.status} - ${error}` };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: `API key test error: ${error}` };
  }
}

/**
 * POST /api/chat - Send message to Gemini API with streaming
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY is not configured. Please add it to .env.local' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const { messages, model, systemPrompt } = body;

    // Validate input
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Validate model name
    const validModels = ['gemini-2.5-flash', 'gemini-1.5-pro-latest', 'gemini-pro'];
    const selectedModel = validModels.includes(model) ? model : 'gemini-2.5-flash';
    
    console.log(`📡 Using model: ${selectedModel}`);

    // Convert messages to Gemini format
    const contents = convertToGeminiFormat(messages, systemPrompt);

    // Prepare Gemini API request - Use generateContent for non-streaming first
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${selectedModel}:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiRequest = {
      contents,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    console.log(`🔗 API URL: ${geminiUrl.replace(GEMINI_API_KEY, '***')}`);
    console.log(`📝 Request contents:`, JSON.stringify(contents, null, 2));

    // Make request to Gemini API
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        model: selectedModel,
        url: geminiUrl.replace(GEMINI_API_KEY, '***')
      });
      
      // Handle specific error codes
      if (response.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      } else if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { success: false, error: 'Invalid API key. Please check your GEMINI_API_KEY in .env.local' },
          { status: 401 }
        );
      } else if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: `Model '${selectedModel}' not found. Please check the model name.` },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: `Gemini API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    console.log('✅ Got response from Gemini API');

    // Parse the non-streaming response
    const data = await response.json();
    
    // Extract text from response
    if (data.candidates && data.candidates[0]?.content?.parts) {
      const fullText = data.candidates[0].content.parts
        .map((part: any) => part.text || '')
        .join('');
      
      console.log(`📤 Sending response (${fullText.length} chars)`);
      
      // Simulate streaming by sending the full text
      const stream = new ReadableStream({
        start(controller) {
          // Send the complete text as a single chunk
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ text: fullText })}\n\n`)
          );
          controller.close();
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      console.error('❌ No valid response from Gemini:', data);
      return NextResponse.json(
        { success: false, error: 'No response text from Gemini API' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
