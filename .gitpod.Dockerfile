FROM gitpod/workspace-full

# Install Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose

# Install additional tools
RUN sudo apt-get update \
    && sudo apt-get install -y \
    curl \
    jq \
    && sudo rm -rf /var/lib/apt/lists/* 