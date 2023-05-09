pipeline {
	agent any
  	environment {
		PROJECT_ID = 'atse-2-385716'
		ZONE = 'us-west1'
    	CLUSTER_NAME = 'quick-chat-application'
    	REPO_URL = 'https://github.com/ajshukla1902/QuickChat.git'
    	CREDENTIALS_ID = "kubernetes"
		APP_NAMESPACE = "deployment.yaml"
  	}
  
	stages {
    	stage('Clone code') {
      	    steps {
        	    checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: env.REPO_URL]]])
      	    }
    	}

    	/*stage('Build Docker Reaact Image') {
      	    steps {
        		sh 'whoami'
        		script {
        			react = docker.build("atse2/quickchatreact:${env.BUILD_ID}")
        		}
        	}
        }

		stage('Build Docker Auth Image') {
      	    steps {
        		sh 'whoami'
        		script {
        			auth = docker.build("atse2/quickchatauth:${env.BUILD_ID}", "-f quick-chat-server-auth/Dockerfile .")
        		}
        	}
        }

		stage('Build Docker Main Image') {
      	    steps {
        		sh 'whoami'
        		script {
        			main1 = docker.build("atse2/quickchatmain:${env.BUILD_ID}", "-f quick-chat-server-main/Dockerfile .")
        		}
        	}
        }

    	stage('Push Docker React Image') {
      	    steps {
        		echo "Push Docker Image"
        		withCredentials([string(credentialsId: 'dockerhub', variable: 'dockerhub')]) {
        			sh "docker login -u atse2 -p ${dockerhub}"
        		}
				script {
        			react.push("${env.BUILD_ID}")
	      	    }
			}
    	}

		stage('Push Docker Auth Image') {
      	    steps {
        		echo "Push Docker Image"
        		withCredentials([string(credentialsId: 'dockerhub', variable: 'dockerhub')]) {
        			sh "docker login -u atse2 -p ${dockerhub}"
        		}
				script {
        			auth.push("${env.BUILD_ID}")
	      	    }
			}
    	}

		stage('Push Docker Main Image') {
      	    steps {
        		echo "Push Docker Image"
        		withCredentials([string(credentialsId: 'dockerhub', variable: 'dockerhub')]) {
        			sh "docker login -u atse2 -p ${dockerhub}"
        		}
				script {
        			main1.push("${env.BUILD_ID}")
	      	    }
			}
    	}*/

		stage('Create Secret for GKE Pods') {
  			steps {
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'Secret.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
				}
    		}
		}

    	/*stage('Deploy to GKE') {
      	    steps {
			    echo "Setting up Env to deploy on GKE.....[!]"
			    sh "sed -i 's/tagversion/${env.BUILD_ID}/g' deployment.yaml"
				sh "sed -i 's/tagversion/${env.BUILD_ID}/g' quick-chat-server-auth/deployment.yaml"
				sh "sed -i 's/tagversion/${env.BUILD_ID}/g' quick-chat-server-main/deployment.yaml"
			    echo "Starting Deployment..... [!]"
				echo "Starting React Deployment..... [!]"
			    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
			    echo "Starting Auth Deployment..... [!]"
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'quick-chat-server-auth/deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
				echo "Starting Main Deployment..... [!]"
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'quick-chat-server-main/deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
				echo "Finished Deployment..... [!]"
        		
      	    }
    	}*/
  	}
}
