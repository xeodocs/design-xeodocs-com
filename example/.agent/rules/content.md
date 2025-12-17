---
trigger: always_on
---

# System Design Repository Structure & Rules

This repository hosts the **pure system design content** (Markdown, OpenAPI, AsyncAPI) for the software project. It is decoupled from the application code and designed to be mounted as a volume into the **XeoContext** viewer via `docker-compose.yml`.

When analyzing this repository or generating code based on it, adhere to the following structural rules and Domain-Driven Design (DDD) principles.

## 1. Directory Structure Overview

The content is located at the **repository root**. It follows a strict separation between **Global Architecture** and **Bounded Contexts (Domains)**.

```text
.
├── docker-compose.yml            # Orchestration to run the viewer locally.
├── xeocontext.config.json        # [MANDATORY] The central navigation and metadata map.
├── global/                       # [MANDATORY] Cross-cutting architectural decisions.
│   ├── adrs/                     # Architecture Decision Records.
│   └── standards/                # Coding conventions, API guidelines, etc.
└── domains/                      # [MANDATORY] Business Logic Modules.
    ├── {domain-name}/            # (e.g., identity, payments, inventory)
    │   ├── readme.md             # [MANDATORY] Domain overview and design.
    │   ├── openapi.yaml          # [OPTIONAL] REST API Root Definition.
    │   └── asyncapi.yaml         # [OPTIONAL] Event-Driven Architecture Root Definition.

```

## 2. The "Global" Directory (The Constitution)

This directory defines the laws of the system. **Always read this first** before generating implementation code.

* **ADRs (`/global/adrs`):** Explain *why* technical decisions were made.
* **Standards (`/global/standards`):** Define naming conventions, error handling patterns, and security protocols that apply to ALL domains.
* **Infrastructure:** Defines shared resources (Kubernetes, Databases, Cloud Providers).

## 3. Domain Modules (Bounded Contexts)

Each folder under `/domains` represents a specific business capability.
*(Note: Any reference to "Identity" in examples below is just a placeholder for a real domain name).*

* **Co-location:** All documentation, API specs, and Event specs related to a domain must reside within that domain's folder.
* **Isolation:** A domain should be understandable in isolation, referencing `global` for shared patterns.

## 4. File Content Rules

### A. Markdown (Mandatory)

Every domain MUST contain at least one `.md` file (usually `readme.md`) describing:

* The problem it solves.
* Key entities and relationships.
* **Frontmatter:** Use YAML frontmatter to link to technical specs.

```yaml
---
domain: {domain-name}
specs:
  rest: ./openapi.yaml
  events: ./asyncapi.yaml
---

```

### B. OpenAPI & AsyncAPI (Fragmented Structure)

If an API or Event interface exists, it must be defined using a **Fragmented Architecture**.

1. **Root Files:** The `openapi.yaml` or `asyncapi.yaml` located at the domain root (`/domains/{name}/openapi.yaml`) act **ONLY as entry points**. They provide the skeleton (info, servers, tags) and link to components.
2. **Usage of `$ref`:** You MUST use `$ref` to link to the actual definitions located in a `components` subdirectory.
3. **Relative Paths:** Always use relative paths for references (e.g., `$ref: './components/schemas/User.yaml'`).

**Required Folder Structure for Specs:**

```text
/domains/{domain-name}/
├── openapi.yaml            # [ROOT] Imports paths from ./components/paths
├── asyncapi.yaml           # [ROOT] Imports messages from ./components/messages
└── components/
    ├── schemas/            # Data models (Shared between REST and Events)
    ├── messages/           # AsyncAPI message definitions
    └── paths/              # OpenAPI path definitions

```

## 5. Instructions for LLM / Code Generation

1. **Context Loading:** When asked to implement a feature for a specific domain, load the context from `domains/{target-domain}` AND `global`.
2. **Implementation Consistency:** Ensure generated code follows the patterns defined in `global/standards`.
3. **Spec-First:** Use the Root YAML files to traverse the `$ref` tree. Treat the resolved full specification as the **source of truth** for generating types, interfaces, and controllers.
4. **Schema Reuse:** If the design links OpenAPI and AsyncAPI to the same schema file in `./components/schemas`, generate a single shared data model in the codebase to maintain consistency.
