pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nottumblr-frontend'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }
        stage('Clean Port 80') {
            steps {
                // Find and remove any container using port 80
                sh """
                CONTAINER_ID=$(docker ps --filter "publish=80" --format "{{.ID}}")
                if [ ! -z "$CONTAINER_ID" ]; then
                    echo "Stopping container on port 80: $CONTAINER_ID"
                    docker stop $CONTAINER_ID
                    docker rm $CONTAINER_ID
                fi
                """
            }
        }
        stage('Docker Run') {
            steps {
                // Stop and remove old container with the same name
                sh "docker stop ${DOCKER_IMAGE} || true"
                sh "docker rm ${DOCKER_IMAGE} || true"
                // Run new container
                sh "docker run -d -p 80:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
    }
}
