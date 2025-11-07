# AI Chatbot Feature

## Overview
A dummy AI chatbot implementation for the Shurokkha platform that provides role-specific assistance to users.

## Features
- **Floating Chat Button**: A circular chat button appears in the bottom-right corner of every page after login
- **Role-Specific Responses**: The chatbot provides contextual responses based on user roles:
  - **Guest**: General information about the platform
  - **Donor**: Donation tracking, impact visualization, tax receipts
  - **Beneficiary**: Available aid, provider connections, eligibility
  - **Provider**: Beneficiary management, analytics, distribution tracking
  - **Admin**: Crisis management, platform analytics, user administration

## Components

### FloatingChatButton (`floating-chat-button.tsx`)
- Renders a circular button in the bottom-right corner
- Only visible when user is authenticated
- Opens/closes the chatbot modal

### ChatbotModal (`chatbot-modal.tsx`)
- Main chat interface with message history
- Auto-scrolling message container
- Typing indicator animation
- Role-specific welcome messages
- Simulated response delay (800-2000ms) for realistic feel

### Chatbot Responses (`chatbot-responses.ts`)
- Contains all dummy response logic
- Pattern matching for common queries
- Role-specific response functions for each user type
- Contextual help based on keywords

## Usage

The chatbot is automatically available on all pages after user login. No additional configuration required.

### User Interactions
1. Click the circular chat button in the bottom-right corner
2. Type a message in the input field
3. Press Enter or click the Send button
4. Receive role-specific responses from the AI assistant

## Response Categories

### Common Responses
- Greetings (hi, hello, hey)
- Thank you acknowledgments
- General help requests

### Donor-Specific
- Donation processes
- Impact tracking
- Tax receipts
- Crisis information

### Beneficiary-Specific
- Available aid programs
- Provider connections
- Eligibility requirements
- Preference updates

### Provider-Specific
- Beneficiary management
- Bulk uploads
- Analytics and reports
- AI matching system
- Provider coordination

### Admin-Specific
- Crisis management
- Platform analytics
- User management
- Blockchain verification
- System monitoring

## Customization

To add new response patterns:

1. Open `chatbot-responses.ts`
2. Add pattern matching in the appropriate role function
3. Return the desired response string

Example:
```typescript
if (lowerInput.match(/(new|custom|pattern)/)) {
  return "Your custom response here!"
}
```

## Future Enhancements
- Integration with actual AI/LLM backend
- Multi-language support (Bengali/English)
- Voice input/output
- File uploads for queries
- Search history and saved conversations
- Suggested questions/quick replies
