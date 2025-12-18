# XeoContext Design Examples

This directory contains three example designs effectively demonstrating XeoContext capabilities. These examples show how XeoContext adapts to render different types of technical content, differing only in the specifications they include:

- **[markdown-openapi-asyncapi](./markdown-openapi-asyncapi)**: A comprehensive example featuring **Markdown** documentation, **OpenAPI** (REST) specifications, and **AsyncAPI** (Event-Driven) specifications.
- **[markdown-openapi](./markdown-openapi)**: An example focusing on **Markdown** documentation and **OpenAPI** specifications, omitting AsyncAPI content.
- **[markdown-asyncapi](./markdown-asyncapi)**: An example focusing on **Markdown** documentation and **AsyncAPI** specifications, omitting OpenAPI content.

These examples act as independent "repositories" that XeoContext can load and render, showcasing the flexibility of the platform.

## How to Run an Example

You can easily run any of these examples using Docker Compose. XeoContext renders the content directly from the file system.

### 1. Navigate to the example directory

Choose the example you want to explore and navigate into its folder:

```bash
cd examples/markdown-openapi-asyncapi
# or
cd examples/markdown-openapi
# or
cd examples/markdown-asyncapi
```

### 2. Start the container

Run the following command to start the XeoContext server for that specific design:

```bash
docker compose up -d
```

Once the container is running and the build finishes, you can access the documentation site at:

**[http://localhost:3000](http://localhost:3000)**

### 3. Stop the container

To stop the server and remove the containers, run:

```bash
docker compose down --volumes --rmi local
```
