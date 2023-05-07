pipeline {
	agent any
  	environment {
		PROJECT_ID = 'atse-2-385716'
    		LOCATION = 'asia-south1'
    		CLUSTER_NAME = 'quick-chat-application'
    		REPO_URL = 'https://github.com/ajshukla1902/QuickChat.git'
    		CREDENTIAL_ID = "kubernetes"
  	}
  
	stages {
    	stage('Clone code') {
      	    steps {
        	    checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: env.REPO_URL]]])
      	    }
    	}

    	stage('Build Docker Image') {
      	    steps {
        		sh 'whoami'
        		script {
        			myImage = docker.build("atse2/quickchatreact:${env.BUILD_ID}")
        		}
        	}
        }

    	stage('Push Docker Image') {
      	    steps {
        		echo "Push Docker Image"
        		withCredentials([string(credentialsId: 'dockerhub', variable: 'dockerhub')]) {
        			sh "docker login -u atse2 -p ${dockerhub}"
        		}
        		myImage.push("${env.BUILD_ID}")
      	    }
    	}

    	stage('Deploy to GKE') {
      	    steps {
			    echo "Setting up Env to deploy on GKE.....[!]"
			    sh "sed -i 's/tagversion/${env.BUILD_ID}/g' deployment.yaml"
    
			    echo "Starting Deployment..... [!]"
			    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialId: env.CREDENTIALS_ID, verifyDeployments: true])
			    echo "Finished Deployment..... [!]"
        		
      	    }
    	}
  	}
}
