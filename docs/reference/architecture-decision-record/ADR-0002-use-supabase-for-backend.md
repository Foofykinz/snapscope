# ADR-0002: Use Supabase for Backend

## Date
2025-01-11

## Status
Accepted

## Context/Problem Statement
SnapScope requires a backend solution to handle:
- User authentication and account management
- Persistent data storage for photo metadata and user preferences
- Offline-first capability with synchronization when connected
- Security requirements for handling insurance-related data

The backend must support the mobile app's need to work seamlessly in areas with intermittent connectivity while maintaining data integrity and security.

## Decision
We will use Supabase as the Backend-as-a-Service (BaaS) platform for SnapScope.

## Decision Drivers
- **Cost effectiveness**: Supabase offers a generous free tier and predictable pricing
- **Team expertise**: Developers are already experienced with Supabase
- **Offline/online capabilities**: Built-in support for progressive/graceful connection and disconnection
- **Security**: Managed authentication service reduces security implementation burden
- **Development speed**: Pre-built authentication and database features accelerate development

## Considered Options
1. **Supabase** - Open-source Firebase alternative with PostgreSQL database
2. **Firebase** - Google's Backend-as-a-Service platform
3. **AWS Amplify** - Amazon's full-stack development platform
4. **Custom Node.js backend** - Too complex for the project's needs and timeline
5. **Parse Platform** - Team lacks experience with this platform
6. **Appwrite** - Team lacks experience with this platform

## Decision Outcome
We selected Supabase because it:
- Provides a fast and simple backend setup
- Handles user authentication through a secure, managed platform
- Offers built-in support for offline/online synchronization
- Uses PostgreSQL, providing a robust and familiar database
- Includes real-time subscriptions for data synchronization
- Has excellent React Native SDK support
- Reduces security risks by offloading authentication to a specialized platform

## Consequences

### Positive
- Rapid development with pre-built authentication flows
- Built-in row-level security for data protection
- Automatic API generation from database schema
- Real-time data synchronization capabilities
- Open-source with self-hosting option if needed
- Strong TypeScript support and type generation
- Reduced backend maintenance burden

### Negative
- Vendor lock-in to Supabase's ecosystem
- Limited customization compared to custom backend
- Dependency on third-party service availability
- Potential latency for users far from Supabase regions
- Learning curve for Supabase-specific features like RLS policies

## Validation
Success will be measured by:
- Authentication flow completion rates > 95%
- Connection/disconnection handling performance with < 2 second sync delays
- Zero data loss during offline/online transitions
- Successful security audit of authentication implementation
- Developer satisfaction with development velocity

## Related Decisions/Dependencies
- ADR-0001: Use React Native for Mobile Development
- Future decision: Data synchronization strategy for offline-first architecture
- Future decision: Supabase storage vs alternative solutions for photo storage
- Future decision: Row-level security policy design

## Contributors/Reviewers
- Adam Veldhousen