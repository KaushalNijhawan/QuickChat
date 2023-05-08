pipeline {
	agent any
  	environment {
		PROJECT_ID = 'atse-2-385716'
    	ZONE = 'asia-south1'
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
				script {
        			myImage.push("${env.BUILD_ID}")
	      	    }
			}
    	}

    	/*stage('Deploy to GKE') {
      	    steps {
			    echo "Setting up Env to deploy on GKE.....[!]"
			    sh "sed -i 's/tagversion/${env.BUILD_ID}/g' deployment.yaml"
    
			    echo "Starting Deployment..... [!]"
			    step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
			    echo "Finished Deployment..... [!]"
        		
      	    }
    	}*/
		stage("Deploy to GKE") {
			steps {
                kubeconfig(caCertificate: '''-----BEGIN CERTIFICATE-----
				MIIELDCCApSgAwIBAgIQAwsfqJ2RmPJtm72WjvGFlDANBgkqhkiG9w0BAQsFADAv
				MS0wKwYDVQQDEyQ2ZDQxZmE4ZC1jMTk3LTRhYWYtODU0MC1mMGYzMzk5ZThlYjAw
				IBcNMjMwNTA2MTU1ODIwWhgPMjA1MzA0MjgxNjU4MjBaMC8xLTArBgNVBAMTJDZk
				NDFmYThkLWMxOTctNGFhZi04NTQwLWYwZjMzOTllOGViMDCCAaIwDQYJKoZIhvcN
				AQEBBQADggGPADCCAYoCggGBALX6Z3F7/AEqhHt6xZSGyi7F+K8HS+NK0rRde3Bn
				GCxdD3xSizdB7JOs5rbhQKoWvQOQpP88KYK0AsJRRNxCUzJ2zcoMvGp1CINzV1v1
				aQGnFNm43Co53dRZM180vvZTZ4whg2tQTrHi8+fJJObnDe+ETTQfnU2DOowMIvc7
				vZp00yvk52t7QxkfMDSBPl0VWl7i5kvqNHn1N2EvGS86J2uhMYnHnt81iQbQDdvi
				wfZjsv9YLjpihUemLrUCSVD+W0p5LvLzUiOKkHgjyvHsRRcSWBBN3tmFEgFWg+pe
				gUw/WtI7WCf83+W4fJX7I27qE96gHIZuxbeWY5WgdODCIfiqa5gPe5yMjzOICRRi
				MGElP4h86arv27F//I8R8Vt/aZ0ilbNxWTAtsWmZiDirQ7Vh8yDWWqITth93MjpI
				jtU1cdC1QP4xaq+qoIQRm9UR9c8yGEJF+R9RJbEd2Y1IrZ5LYAgR8G4L+aBdEO4R
				zuFzdZ1144B2Sv4Syu72IGNuUQIDAQABo0IwQDAOBgNVHQ8BAf8EBAMCAgQwDwYD
				VR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU4r/UsMMURsVXOnOygAydfnakpQwwDQYJ
				KoZIhvcNAQELBQADggGBAAtvqyeCyau5V4lt2H+qxkKJ2536BFoj6PhXR63HmrFB
				IRUg/8oTPf4RqT1FGr7sJIYy3ssRGvxqnEvpUTCXsDPuDmR+jjrJv/Za/HoBPJVy
				OZ+/OXymdxH+I9B4AUp/vgYtb1ypB02twLu5YtMDJipa0AxNNUOhkM7pOlWqEiK3
				S/5TWSqKcGH7J6FL9rRD85EDUMopR2+jXV9Hu2CUMSp50L9bOn5dUlvBQgnO8FrJ
				pcPZhUIsg8sj9sR00iUJ8JSh5o3uecCc4uVG/4OPen2Fr4qyI0zpzvqRi+t4pDKO
				0ARDDxFNKOCkgedkoQs0hLi9/kpWOfbsTLk3wPZjnyTqf5b7OUJNV8dfEV9RH/Ca
				E7jT89g4eRt6lebXBs9TTcd33fu+E2VQfsozBpD9Pu7rv07uw4Kn520vp7/XxA0U
				I1jzTzeC9z9K4cLpxJiyap6xss7wfau5hv9laaRemDCL+7hlMqx2n6JOo6qctqjJ
				F3k/I3EU4kjmkzO1E6451g==
				-----END CERTIFICATE-----''', credentialsId: 'kb', serverUrl: 'https://35.200.173.242') {
				gcloud container clusters get-credentials quick-chat-application --region asia-south1 --project atse-2-385716
				//kubectl -f deployment.yaml
				}
			}	
		}
  	}
}
