# Data Bank

## Overview

The Douglas Data Bank is an open-source web application for managing, versioning, and sharing tabular datasets. Is is developed as a generic tool applicable across a range of research environments.

## Key Features

- **Upload Datasets**: Users can seamlessly upload their tabular datasets in various formats like CSV and Excel.
- **Version Control**: Each time a dataset is modified, Data Bank keeps track of the changes and automatically generates a changelog.
- **Centralized Storage**: Ensure all datasets are stored centrally, making it easier for collaboration and reference.
- **Selective Sharing**: Users have the capability to decide who gets access to their datasets and even provide selective access to individual variables (columns) within them.
- **User Management**: Designed for clinicians and researchers without a programming background. This feature allows them to manage user permissions effectively on their own.
- **Project Organization**: Datasets can be systematically organized into projects for better structuring and clarity.

## Use Case

Researchers at institutions like the Douglas Research Centre often work with sensitive data. They need a robust platform where they can safely manage and share their data. The Data Bank platform makes it straightforward for an average user with no programming experience to maintain their lab's datasets and regulate access as required.

## Getting Started (Development Setup)

### Install Bun

```shell
curl -fsSL https://bun.sh/install | bash
```

### Install Dependencies

```shell
bun install
```

### Setup Config

```shell
awk -v secret_key="$(openssl rand -hex 16)" '/^SECRET_KEY=/{print $0 secret_key;next}1' .env.template > .env
```

### Launch Dev Server

```shell
bun dev
```

## Getting Started (Production Deployment)

### Prerequisites

We recommend deploying using Docker Compose. This tool orchestrates several services together, including the web portal, REST API, MongoDB dataset, and the Caddy web server. Don't worry if you're new to Docker; no prior experience is necessary. Just make you have Docker and Docker Compose installed. For information on installing Docker, please refer to the [official documentation](https://docs.docker.com/).

### Configuration

User configuration is managed through environment variables. Start by creating a .env file using the supplied template:

```shell
cp .env.template .env
```

Detailed comments are provided for all configurations options.

### Launch

Once you have set the required environment variables, you can launch the stack:

```shell
docker compose up
```

## Contribution

We welcome contributions! If you're interested in improving the Data Bank platform or adding new features, please refer to our Contribution Guide.

## License

Copyright (C) 2023 Douglas Neuroinformatics Platform

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
