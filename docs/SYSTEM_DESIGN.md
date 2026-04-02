# System Design: Gatherly Event-Driven Architecture

## 1. Event-Driven Strategy & Architecture Overview

Gatherly is built around an **Event-Driven Architecture (EDA)** combined with a Serverless computing model. Rather than relying on synchronous, monolithic request-response cycles, the platform's core functionalities are decoupled and operate on trigger-based execution. 

This model ensures maximum resilience. When a high-volume process (like parsing 5000+ volunteer records for skill-matching) runs, the frontend is not blocked, and API Gateway traffic remains fully available.

### How Events Flow
1. **Event Ingestion:** A client application (e.g., Next.js dashboard) or external system triggers an HTTP request via the AWS API Gateway. 
2. **Synchronous Validation:** The API Gateway invokes an initial synchronous Lambda function which validates the payload, acknowledges the request (HTTP 200/202), and immediately offloads the heavy lifting.
3. **Asynchronous Dispatch (Background Jobs):** The initial function passes a message to an event bus or background processing queue (e.g., SQS, EventBridge, or direct async Lambda invocations). This decouples event ingestion from event processing.
4. **Service Communication (Choreography):** Microservices communicate implicitly. When the `EventCreated` event fires, the `SkillMatcher` service wakes up to find volunteers, and upon completion, emits a `MatchesFound` event which triggers the `NotificationDispatcher`.

### Asynchronous Workflows & Trigger-Based Execution
- **LLM-Augmented AI Workflow:** When a volunteer signs up, a trigger executes a background job using LLM APIs to automatically extract and normalize the volunteer's skills from free-text into a structured taxonomy.
- **Trigger-Based Notifications:** A database stream (e.g. MongoDB Change Streams) listens for a `slots_filled` reaching its limit capacity. The trigger automatically fires an event that pauses RSVP processing and alters the Next.js visual state to `FILLED`.

---

## 2. API Design: Structured Endpoints

We have **Designed APIs** using a RESTful pattern with strict OpenAPI-compliant structured endpoints for event ingestion, workflow creation, and execution tracking.

| Endpoint | Method | Purpose | Execution Model |
| --- | --- | --- | --- |
| `/api/v1/events` | `POST` | Event Ingestion. Initiates the workflow pipeline. | Sync Response, Async Processing |
| `/api/v1/workflows/trigger` | `POST` | Trigger custom automation workflows manually. | Asynchronous |
| `/api/v1/execution/{run_id}` | `GET` | Execution tracking. Poll job status. | Synchronous |
| `/api/v1/rsvps/{event_id}` | `POST` | Volunter confirmation or declination. | Sync Response, Async Metrics Update|
| `/api/v1/volunteers/onboard` | `POST` | Add a volunteer; triggers LLM background job. | Sync Response, Async LLM |

---

## 3. Database Design: MongoDB Schema

Migrating to a NoSQL Document Store (MongoDB) is crucial for an event-driven platform handling varied metadata and dynamically scaling fast read/write throughputs. 

### Engineering Thinking
- **Denormalization vs Reference:** We heavily pre-calculate and denormalize state attributes (e.g. `slots_filled`) directly on the `Event` document so read queries from the dashboard remain sub-10ms.
- **Workflow State Management:** Execution states and error tracing are stored inside a dedicated `WorkflowExecutions` collection, enabling traceability and retry mechanisms on failure.

### Collection: `events`
Modeled for fast spatial location queries and state filtering.
```json
{
  "_id": "ObjectId('...')",
  "event_id": "EVT_20260402_A1B2C3",
  "name": "Community Food Drive",
  "schedule": {
    "date": "2026-04-15",
    "time": "09:00:00Z"
  },
  "requirements": {
    "slots_total": 50,
    "slots_filled": 12,
    "skills_needed": ["leadership", "lifting", "transportation"]
  },
  "state": "OPEN", // ENUM: OPEN, FILLED, COMPLETED, CANCELLED
  "workflow_status": {
    "invitations_dispatched": true,
    "last_sync_timestamp": "2026-04-02T12:00:00Z"
  }
}
```

### Collection: `volunteers`
Embeds the LLM-normalized taxonomy.
```json
{
  "_id": "ObjectId('...')",
  "volunteer_id": "VOL_987654",
  "contact": {
    "email": "shreyas@example.com",
    "phone": "+1234567890"
  },
  "raw_bio": "I am great at organizing people and I have a truck.",
  "ai_normalized_skills": ["leadership", "logistics", "heavy_transport"], 
  "trust_score": 98.5
}
```

### Collection: `workflow_executions`
For tracing background task state in the event-driven system.
```json
{
  "_id": "ObjectId('...')",
  "trigger_source": "API_GATEWAY",
  "event_type": "VOLUNTEER_MATCHING",
  "target_event_id": "EVT_20260402_A1B2C3",
  "status": "COMPLETED", // ENUM: PENDING, RUNNING, COMPLETED, FAILED
  "started_at": "2026-04-02T09:01:00Z",
  "completed_at": "2026-04-02T09:01:03Z",
  "error_log": null,
  "metrics": {
    "candidates_scanned": 1500,
    "matches_found": 84
  }
}
```

---

## 4. LLM API Integration for Dynamic Decision Making
The pipeline leverages large language models during the ingestion events.
- **Skill Extraction:** Raw user input is passed via Lambda to an LLM to map arbitrary strings ("I've run a marathon") to structured capabilities ("stamina", "physical_endurance").
- **Dynamic Decision Logic:** Instead of hardcoded if/else rules, the LLM processes contextual data for complex matchmaking, evaluating a volunteer's unstructured past experiences against an event's nuanced requirements for optimal automated matching. Intelligently matching volunteers enables hyper-personalized outreach.
