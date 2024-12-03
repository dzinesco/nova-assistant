import { ServiceConfig, ServiceType } from '../contexts/ServicesContext';

interface TestResult {
  success: boolean;
  message: string;
}

// Test functions for each provider
const testOpenAI = async (credentials: any): Promise<TestResult> => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Invalid API key');
    }
    
    return { success: true, message: 'Successfully connected to OpenAI' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to connect to OpenAI' };
  }
};

const testAnthropicAPI = async (credentials: any): Promise<TestResult> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': credentials.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        model: credentials.model || 'claude-3-opus',
        max_tokens: 1,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid API key');
    }
    
    return { success: true, message: 'Successfully connected to Anthropic' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to connect to Anthropic' };
  }
};

const testOllama = async (credentials: any): Promise<TestResult> => {
  try {
    const response = await fetch(`${credentials.endpoint}/api/tags`);
    if (!response.ok) {
      throw new Error('Failed to connect to Ollama instance');
    }
    return { success: true, message: 'Successfully connected to Ollama' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to connect to Ollama instance' };
  }
};

const testGmail = async (credentials: any): Promise<TestResult> => {
  try {
    // In a real implementation, we would use the Google OAuth flow
    // This is a simplified check for required credentials
    if (!credentials.clientId || !credentials.clientSecret) {
      throw new Error('Missing required credentials');
    }
    return { success: true, message: 'Credentials validated (OAuth flow required)' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to validate Gmail credentials' };
  }
};

const testOutlook = async (credentials: any): Promise<TestResult> => {
  try {
    // Similar to Gmail, we would use Microsoft OAuth flow
    if (!credentials.clientId || !credentials.clientSecret) {
      throw new Error('Missing required credentials');
    }
    return { success: true, message: 'Credentials validated (OAuth flow required)' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to validate Outlook credentials' };
  }
};

const testSMTP = async (credentials: any): Promise<TestResult> => {
  try {
    // In production, we would attempt to create an SMTP connection
    const required = ['host', 'port', 'username', 'password'];
    const missing = required.filter(field => !credentials[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return { success: true, message: 'SMTP credentials validated' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to validate SMTP credentials' };
  }
};

const testDropbox = async (credentials: any): Promise<TestResult> => {
  try {
    const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Invalid access token');
    }
    
    return { success: true, message: 'Successfully connected to Dropbox' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to connect to Dropbox' };
  }
};

const testGDrive = async (credentials: any): Promise<TestResult> => {
  try {
    // Similar to Gmail, would use Google OAuth flow
    if (!credentials.clientId || !credentials.clientSecret) {
      throw new Error('Missing required credentials');
    }
    return { success: true, message: 'Credentials validated (OAuth flow required)' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to validate Google Drive credentials' };
  }
};

const testNotion = async (credentials: any): Promise<TestResult> => {
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });
    
    if (!response.ok) {
      throw new Error('Invalid API key');
    }
    
    return { success: true, message: 'Successfully connected to Notion' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to connect to Notion' };
  }
};

// Map of test functions for each provider
const testFunctions: Record<string, (credentials: any) => Promise<TestResult>> = {
  openai: testOpenAI,
  anthropic: testAnthropicAPI,
  ollama: testOllama,
  gmail: testGmail,
  outlook: testOutlook,
  smtp: testSMTP,
  dropbox: testDropbox,
  gdrive: testGDrive,
  notion: testNotion,
};

export const testService = async (service: ServiceConfig): Promise<TestResult> => {
  const testFn = testFunctions[service.provider];
  if (!testFn) {
    return { success: false, message: `No test available for provider: ${service.provider}` };
  }
  
  try {
    return await testFn(service.credentials || {});
  } catch (error) {
    return { success: false, message: error.message || 'Test failed' };
  }
};
