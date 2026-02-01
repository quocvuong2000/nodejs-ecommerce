# AI Coding Assistant Instructions

## Architecture Overview

This is a Node.js ecommerce microservices workspace with three main projects:

### ecommerce-backend (`/ecommerce-backend/`)

**Layered Architecture**: Controller → Service → Repository pattern

- **Controllers** (`src/controllers/`): Handle HTTP requests using standardized response format
- **Services** (`src/services/`): Business logic layer, call repositories and other services
- **Repositories** (`src/models/repositories/`): Data access layer with MongoDB queries
- **Models** (`src/models/`): Mongoose schemas with separate models per domain

**Authentication Flow**: API Key → Permission check → JWT tokens (access/refresh with RSA256)

- API keys validated via `x-api-key` header in `auth/checkAuth.js`
- JWT tokens use public/private key pairs stored in `keytoken.model.js`
- Refresh token rotation implemented in `access.service.js`

### system-message-queue (`/system-message-queue/`)

Message queue implementation with RabbitMQ/Kafka integration

### Study Materials (`/documents/`)

Design patterns, database concepts, and architecture documentation

## Project Conventions

**Response Patterns**: Use standardized response classes from `src/core/`

```javascript
// Success responses
new SuccessResponse({ message, metadata }).send(res);
new CREATED({ message, metadata, options }).send(res);

// Error handling
throw new BadRequestError('Custom message');
throw new NotFoundError('Resource not found');
```

**Service Layer Pattern**: Services are static classes with descriptive method names

```javascript
class ProductService {
  static async createProduct(payload) {
    /* implementation */
  }
  static async findAllProducts(query) {
    /* implementation */
  }
}
```

**Repository Pattern**: Separate repo files in `models/repositories/` for complex queries

- Use `.lean()` for read-only operations
- Include proper MongoDB population and selection

**Model Naming**: Consistent schema structure with timestamps and collections

- Document name in CAPS: `DOCUMENT_NAME = 'Product'`
- Collection name plural: `COLLECTION_NAME = 'Products'`

## Development Workflows

**Start Services**:

```bash
cd ecommerce-backend && npm run dev  # Starts with --watch
docker-compose up kafka             # Kafka message broker
```

**Dependencies**: Key external services

- **MongoDB**: Primary database (config in `src/configs/config.mongodb.js`)
- **Redis**: Pub/Sub messaging (`redisPubSub.service.js`)
- **Kafka**: Message queuing (Docker setup available)

**Testing**: Event-driven testing pattern in `src/tests/`

- Uses Redis pub/sub for integration testing
- Test services simulate real event flows

## Key Integration Patterns

**Redis Pub/Sub**: Event-driven communication between services

- Publisher: `redisPubSubService.publish(channel, message)`
- Subscriber: `redisPubSubService.subscribe(channel, callback)`
- Example: Inventory updates triggered by purchase events

**Factory Pattern**: Dynamic product type creation in `product.service.xxx.js`

- Registry-based factory for different product types (clothing, electronics, furniture)
- Extensible design for adding new product categories

**Middleware Chain**: Express app setup in `src/app.js`

1. Logging (morgan)
2. Security (helmet)
3. Compression
4. API key validation
5. Permission checks
6. Route handling

## File Organization

- **Route versioning**: `/v1/api/{domain}` pattern
- **Environment configs**: Environment-specific configs in `src/configs/`
- **Error handling**: Centralized error classes in `src/core/error.response.js`
- **Utilities**: Helper functions in `src/utils/` and `src/helpers/`

When working on this codebase, follow the established patterns for consistency and leverage the existing infrastructure for authentication, error handling, and database operations.
