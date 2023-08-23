pipeline {
	agent any
  	environment {
		PROJECT_ID = 'burnished-flare-396308'
		ZONE = 'us-central1'
    	CLUSTER_NAME = 'jenkins-chat-app-cluster'
    	REPO_URL = 'https://github.com/KaushalNijhawan/QuickChat.git'
    	CREDENTIALS_ID = "kubernetes"
		APP_NAMESPACE = "deployment.yaml"
  	}

	stages {
    	stage('Clone code from GitHub Repo') {
      	    steps {
        	    checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: env.REPO_URL]]])
      	    }
    	}

    	stage('Build Docker React Image') {
      	    steps {
        		script {
        			react = docker.build("atse2/quickchatreact:${env.BUILD_ID}")
        		}
        	}
        }

		stage('Build Docker Auth Image') {
      	    steps {
        		script {
        			auth = docker.build("atse2/quickchatauth:${env.BUILD_ID}", "./quick-chat-server-auth/")
        		}
        	}
        }

		stage('Build Docker Main Image') {
      	    steps {
        		script {
        			main1 = docker.build("atse2/quickchatmain:${env.BUILD_ID}", "./quick-chat-server-main/")
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
    	}

    	stage('GKE Environment Setup') {
      	    steps {
			    echo "Setting up Env to deploy on GKE.....[!]"
			    sh "sed -i 's/tagversion/${env.BUILD_ID}/g' deployment.yaml"
				sh "sed -i 's/tagversion/${env.BUILD_ID}/g' quick-chat-server-auth/deployment.yaml"
				sh "sed -i 's/tagversion/${env.BUILD_ID}/g' quick-chat-server-main/deployment.yaml"
			}
		}

		stage('Deploy React Image to GKE Pod') {
			steps {
				echo "Starting React Deployment..... [!]"
			    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
				echo "Finished React Deployment..... [!]"
			}
		}

		stage('Deploy Auth Image to GKE Pod') {
			steps {
				echo "Starting Auth Deployment..... [!]"
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'quick-chat-server-auth/deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
				echo "Finished Auth Deployment..... [!]"
			}
		}

		stage('Deploy Main Image to GKE Pod') {
			steps {
				echo "Starting Main Deployment..... [!]"
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.ZONE, manifestPattern: 'quick-chat-server-main/deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
				echo "Finished Main Deployment..... [!]"
			}
		}
	}
}
