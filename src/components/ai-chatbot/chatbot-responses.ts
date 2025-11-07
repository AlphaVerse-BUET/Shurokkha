import type { UserRole } from "@/types"

// Dummy response generator based on user role and input
export function getDummyResponse(
  input: string,
  role: UserRole,
  userName?: string
): string {
  const lowerInput = input.toLowerCase()

  // Common greetings
  if (lowerInput.match(/^(hi|hello|hey|greetings)/)) {
    return `Hello${userName ? ` ${userName}` : ""}! How can I assist you today?`
  }

  // Thank you responses
  if (lowerInput.match(/(thank|thanks)/)) {
    return "You're welcome! Feel free to ask if you need anything else. 😊"
  }

  // Help requests
  if (lowerInput.match(/(help|assist|support)/)) {
    return getRoleSpecificHelp(role)
  }

  // Role-specific responses
  switch (role) {
    case "donor":
      return getDonorResponse(lowerInput, userName)
    case "beneficiary":
      return getBeneficiaryResponse(lowerInput, userName)
    case "provider":
      return getProviderResponse(lowerInput, userName)
    case "admin":
      return getAdminResponse(lowerInput, userName)
    default:
      return getGuestResponse(lowerInput)
  }
}

function getRoleSpecificHelp(role: UserRole): string {
  switch (role) {
    case "donor":
      return `I can help you with:
• Finding active crises and donation opportunities
• Tracking your donation history and impact
• Viewing impact maps and beneficiary stories
• Managing your donor profile and preferences
• Understanding tax receipts and documentation

What would you like to know more about?`
    case "beneficiary":
      return `I can help you with:
• Viewing available aid and services
• Updating your preferences and needs
• Finding nearby service providers
• Checking your eligibility for programs
• Managing your beneficiary profile

What would you like to know more about?`
    case "provider":
      return `I can help you with:
• Managing beneficiaries and distributions
• Uploading bulk beneficiary data
• Viewing analytics and performance metrics
• Optimizing resource allocation
• Coordinating with other providers

What would you like to know more about?`
    case "admin":
      return `I can help you with:
• Creating and managing crises
• Monitoring platform analytics
• Managing users and providers
• Reviewing system performance
• Generating reports and insights

What would you like to know more about?`
    default:
      return `I can help you with:
• Understanding how Shurokkha works
• Learning about our features
• Finding information about donation processes
• Exploring transparency initiatives

Please log in for personalized assistance!`
  }
}

function getDonorResponse(input: string, userName?: string): string {
  if (input.match(/(donate|donation|give|contribute)/)) {
    return `Great question${userName ? ` ${userName}` : ""}! You can make a donation by:
1. Visiting the 'Donate' page from the dashboard
2. Selecting an active crisis or beneficiary
3. Choosing your donation amount (supports BDT, USD, EUR)
4. Completing the secure payment process

Your donation will be tracked transparently with blockchain verification and you'll receive real-time updates on its impact! 🎯`
  }

  if (input.match(/(impact|track|history|receipt)/)) {
    return `You can track your impact by:
• Visiting your donor profile to see donation history
• Checking the Impact Map to see geographical distribution
• Viewing beneficiary success stories
• Downloading tax receipts from the Receipt page

All donations are tracked with blockchain transparency! 📊`
  }

  if (input.match(/(crisis|emergency|disaster)/)) {
    return `To find active crises:
• Visit the Crises page to see all current emergencies
• Filter by location, type, or urgency
• View real-time updates and funding progress
• Select a crisis to see detailed information and beneficiaries

We currently support flood relief, healthcare emergencies, and educational aid across Bangladesh. 🌍`
  }

  if (input.match(/(tax|receipt|document)/)) {
    return `For tax receipts:
• All donations automatically generate receipts
• Visit the Receipt page to view and download
• Receipts include all necessary tax information
• You can filter by date range and download in PDF format

All receipts are stored securely and accessible anytime! 📄`
  }

  return `That's a great question! As a donor, you have access to:
• Real-time crisis tracking and updates
• Transparent donation allocation
• Impact visualization on maps
• Beneficiary stories and outcomes
• Tax receipts and documentation

Is there something specific you'd like to explore? Feel free to navigate through your dashboard! 💝`
}

function getBeneficiaryResponse(input: string, userName?: string): string {
  if (input.match(/(aid|help|assistance|support|receive)/)) {
    return `${userName ? `${userName}, t` : "T"}o access available aid:
1. Update your preferences on the Preferences page
2. Browse available providers in your area
3. Check your eligibility status
4. Connect with matching service providers

Our AI system helps match you with the most relevant aid programs! 🤝`
  }

  if (input.match(/(provider|service|organization)/)) {
    return `To find service providers:
• Visit the Providers page from your dashboard
• View providers near your location
• Check their available services and resources
• See real-time availability status
• Contact them directly through the platform

We work with verified NGOs and government agencies across Bangladesh! 🏥`
  }

  if (input.match(/(preference|need|update|profile)/)) {
    return `To update your preferences:
1. Go to your Profile page
2. Navigate to Preferences section
3. Select your needs (food, medical, education, shelter)
4. Update location and family details
5. Save changes for better matching

The system will automatically match you with relevant aid programs! ⚙️`
  }

  if (input.match(/(eligib|qualify|criteria)/)) {
    return `Eligibility is determined by:
• Your registered needs and preferences
• Location and proximity to services
• Family size and situation
• Specific crisis requirements
• Provider capacity and resources

Our AI matching system ensures fair and efficient distribution! ✅`
  }

  return `As a beneficiary${userName ? ` ${userName}` : ""}, you can:
• Access aid programs tailored to your needs
• Connect with verified service providers
• Update your preferences and profile
• Track aid distributions
• Receive real-time notifications

How can I help you navigate these features? 🌟`
}

function getProviderResponse(input: string, userName?: string): string {
  if (input.match(/(beneficiar|distribute|allocation)/)) {
    return `For beneficiary management:
• View all matched beneficiaries on your dashboard
• Check beneficiary needs and preferences
• Update distribution status in real-time
• Track resource allocation efficiency
• Use bulk upload for large-scale distributions

Our system helps optimize your distribution based on priority and proximity! 📦`
  }

  if (input.match(/(upload|bulk|data|csv)/)) {
    return `To upload beneficiary data:
1. Navigate to Bulk Upload page
2. Download the CSV template
3. Fill in beneficiary information
4. Upload the completed file
5. Review and confirm the data

The system will automatically process and match beneficiaries with available aid! 📊`
  }

  if (input.match(/(analytics|report|performance|metric)/)) {
    return `Access your analytics by:
• Visiting the Analytics page
• Viewing distribution metrics and trends
• Checking beneficiary satisfaction scores
• Monitoring resource utilization
• Generating custom reports

All data is updated in real-time with blockchain verification! 📈`
  }

  if (input.match(/(matching|ai|algorithm|optimization)/)) {
    return `Our AI matching system:
• Analyzes beneficiary needs and priorities
• Optimizes resource allocation
• Considers geographical proximity
• Factors in provider capacity
• Ensures fair distribution

You can view matching suggestions on your dashboard and adjust as needed! 🤖`
  }

  if (input.match(/(coordinat|collaborate|other provider)/)) {
    return `For provider coordination:
• View other providers in your region
• Share resource availability
• Coordinate distribution efforts
• Avoid duplicate allocations
• Exchange best practices

Collaboration helps maximize impact and efficiency! 🤝`
  }

  return `${userName ? `${userName}, as` : "As"} a service provider, you can:
• Manage beneficiaries efficiently
• Upload and track distributions
• View detailed analytics
• Optimize resource allocation
• Coordinate with other providers

What specific aspect would you like to explore? 🚀`
}

function getAdminResponse(input: string, userName?: string): string {
  if (input.match(/(crisis|emergency|create|manage)/)) {
    return `For crisis management:
• Create new crisis entries with detailed information
• Set funding goals and priorities
• Assign service providers
• Monitor real-time progress
• Update status and allocations
• Close and archive completed crises

Visit the Create Crisis page to add new emergencies to the system! 🚨`
  }

  if (input.match(/(analytics|dashboard|report|metric|statistics)/)) {
    return `Access comprehensive analytics:
• Platform-wide donation statistics
• Beneficiary distribution maps
• Provider performance metrics
• Crisis funding progress
• User engagement data
• Blockchain transaction verification

The Analytics page provides real-time insights across all operations! 📊`
  }

  if (input.match(/(user|provider|beneficiary|manage|approve)/)) {
    return `For user management:
• View all registered users by role
• Approve or verify providers
• Monitor beneficiary registrations
• Manage user permissions
• Review flagged accounts
• Export user data for reporting

Access the user management section from your admin dashboard! 👥`
  }

  if (input.match(/(blockchain|verification|transparency|audit)/)) {
    return `Blockchain transparency features:
• All donations are recorded on blockchain
• Real-time transaction verification
• Immutable audit trails
• Public transparency reports
• Automated fraud detection
• Compliance monitoring

This ensures complete transparency and trust in the platform! 🔐`
  }

  if (input.match(/(performance|system|monitor|status)/)) {
    return `System monitoring includes:
• Real-time platform health status
• API response times
• Database performance
• User activity metrics
• Error logs and alerts
• Resource utilization

You can access detailed system logs from the admin dashboard! 💻`
  }

  return `${userName ? `${userName}, as an` : "As an"} administrator, you have full control:
• Create and manage crises
• Monitor all platform activity
• Review analytics and reports
• Manage users and providers
• Ensure system performance
• Maintain transparency standards

What would you like to manage today? 🎯`
}

function getGuestResponse(input: string): string {
  if (input.match(/(what|about|platform|shurokkha)/)) {
    return `Shurokkha is an AI-powered transparent donation platform for Bangladesh humanitarian aid. We provide:
• Blockchain-verified transparent donations
• Real-time impact tracking
• AI-powered beneficiary matching
• Multi-stakeholder coordination
• Geographic impact visualization

Please log in to access personalized features! 🌍`
  }

  if (input.match(/(login|sign|register|account)/)) {
    return `To get started:
1. Click the Login button in the top right
2. Select your role (Donor, Beneficiary, Provider, Admin)
3. Complete the authentication process
4. Access your personalized dashboard

Each role has unique features tailored to your needs! 🔑`
  }

  if (input.match(/(donate|donation|give)/)) {
    return `To make a donation:
1. Create a donor account or log in
2. Browse active crises
3. Select beneficiaries or crisis to support
4. Choose your donation amount
5. Complete secure payment

All donations are tracked with blockchain transparency! 💝`
  }

  if (input.match(/(transparent|blockchain|track)/)) {
    return `Our transparency features:
• Blockchain-verified transactions
• Real-time tracking of donations
• Public impact reports
• Beneficiary outcome stories
• Geographic impact visualization

This ensures every donation reaches its intended recipient! ✅`
  }

  return `Thank you for your interest in Shurokkha! We're a transparent donation platform serving Bangladesh. 

To get personalized assistance, please log in to access role-specific features. I can help you understand:
• How the platform works
• Different user roles
• Donation processes
• Transparency initiatives

What would you like to know more about? 🤗`
}
