# Testing Socket.io Chat

## 🎯 Real-Time Chat with Batch Isolation

Your chat system automatically joins users to rooms based on their batch (year + branch).

---

## Prerequisites

1. **Server running**: `npm run dev`
2. **2 JWT tokens** from different batches

---

## Test Setup

### Step 1: Get JWT Tokens

Register two users (or use existing ones):

```bash
# Alice (2026, CS)
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.cs2026@test.com","password":"securepass123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])"

# Bob (2025, MECH)
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bob.mech2025@test.com","password":"securepass123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])"
```

Save these tokens!

---

## WebSocket Connection Test

### Using Node.js (Recommended)

Create `test-chat.js`:

```javascript
import { io } from 'socket.io-client';

const ALICE_TOKEN = 'YOUR_ALICE_TOKEN_HERE';
const BOB_TOKEN = 'YOUR_BOB_TOKEN_HERE';

// Alice connects
const aliceSocket = io('http://localhost:3000', {
  query: { token: ALICE_TOKEN }
});

aliceSocket.on('connected', (data) => {
  console.log('✅ Alice connected:', data);
  
  // Alice sends a message
  aliceSocket.emit('sendMessage', {
    content: 'Hello from CS 2026!'
  });
});

aliceSocket.on('newMessage', (msg) => {
  console.log('💬 Alice received:', msg);
});

// Bob connects
const bobSocket = io('http://localhost:3000', {
  query: { token: BOB_TOKEN }
});

bobSocket.on('connected', (data) => {
  console.log('✅ Bob connected:', data);
  
  // Bob sends a message
  bobSocket.emit('sendMessage', {
    content: 'Hello from MECH 2025!'
  });
});

bobSocket.on('newMessage', (msg) => {
  console.log('💬 Bob received:', msg);
});

bobSocket.on('error', (err) => {
  console.error('❌ Error:', err);
});
```

**Run:**
```bash
npm install socket.io-client
node test-chat.js
```

**Expected:**
- ✅ Alice sees her own message
- ✅ Bob sees his own message
- ❌ Alice **DOES NOT** see Bob's message (different rooms!)
- ❌ Bob **DOES NOT** see Alice's message

---

### Using Browser Console

Open browser console and run:

```javascript
// Load socket.io client
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
document.head.appendChild(script);

// Wait 1 second, then connect
setTimeout(() => {
  const token = 'YOUR_JWT_TOKEN';
  
  const socket = io('http://localhost:3000', {
    query: { token }
  });
  
  socket.on('connected', (data) => {
    console.log('Connected:', data);
    
    // Send a message
    socket.emit('sendMessage', {
      content: 'Hello from browser!'
    });
  });
  
  socket.on('newMessage', (msg) => {
    console.log('New message:', msg);
  });
  
  socket.on('error', (err) => {
    console.error('Error:', err);
  });
}, 1000);
```

---

## Socket.io Events

### Client → Server

**Connect:**
```javascript
socket.query = { token: 'JWT_TOKEN' }
```

**Send Message:**
```javascript
socket.emit('sendMessage', {
  content: 'Your message here'
});
```

**Get Message History:**
```javascript
socket.emit('getMessages', {
  limit: 50  // Optional
});
```

**Typing Indicator:**
```javascript
socket.emit('typing', {
  isTyping: true
});
```

---

### Server → Client

**Connected:**
```javascript
socket.on('connected', (data) => {
  // { message, roomId, user }
});
```

**New Message:**
```javascript
socket.on('newMessage', (msg) => {
  // { id, content, sender, createdAt }
});
```

**Message History:**
```javascript
socket.on('messageHistory', (data) => {
  // { roomId, messages: [...] }
});
```

**User Typing:**
```javascript
socket.on('userTyping', (data) => {
  // { userId, firstName, isTyping }
});
```

**Error:**
```javascript
socket.on('error', (err) => {
  // { message }
});
```

---

## Testing Batch Isolation

### Scenario: Three Students

1. **Alice** (2026, CS)
2. **Charlie** (2026, CS) - Same batch as Alice
3. **Bob** (2025, MECH) - Different batch

**Expected Behavior:**
- ✅ Alice and Charlie see each other's messages
- ✅ Bob sees his own messages
- ❌ Alice/Charlie **DO NOT** see Bob's messages
- ❌ Bob **DOES NOT** see Alice/Charlie's messages

---

## Room Names

Rooms are automatically generated:
```
room_${year}_${branch}
```

Examples:
- `room_2026_CS`
- `room_2025_MECH`
- `room_2024_ECE`

---

## Database Verification

Check messages in database:

```sql
SELECT 
  id,
  content,
  year,
  branch,
  room_id,
  created_at
FROM messages
ORDER BY created_at DESC
LIMIT 10;
```

**Verify:**
- ✅ Each message has correct `year` and `branch`
- ✅ `room_id` matches `room_${year}_${branch}` format
- ✅ No cross-batch messages

---

## Security Features

1. **JWT Handshake Auth** - Invalid tokens rejected at connection
2. **Auto Room Joining** - Users can't manually join other rooms
3. **Batch-Scoped Queries** - Message history filtered by batch
4. **Broadcast Isolation** - Messages only sent to same room
5. **Soft Deletes** - Message history preserved

---

## Common Issues

### "Authentication token required"
- Missing token in handshake
- Add `query: { token: 'JWT' }` or `auth: { token: 'JWT' }`

### "Invalid or expired token"
- JWT expired (7 days)
- Generate new token via `/auth/login`

### Messages not received
- Users in different rooms (different batch)
- Check `roomId` in `connected` event

---

## Production Considerations

1. **Scale with Redis** - Use Redis adapter for multi-server deployments
2. **Rate Limiting** - Limit messages per minute
3. **Message Length** - Already limited to 5000 chars
4. **File Sharing** - Add file upload events
5. **Read Receipts** - Track who read messages

---

## Architecture

```
Client (JWT) → Socket.io Handshake → Verify JWT
                ↓
         Extract (year, branch)
                ↓
         Auto-join room_${year}_${branch}
                ↓
         Listen for sendMessage event
                ↓
         Save to DB + Broadcast to room
```

**Key Feature**: Zero manual room management - everything automatic based on JWT!
