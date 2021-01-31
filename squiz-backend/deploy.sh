#!/bin/bash

APP_PREPROD_YAML="$(pwd)/app-preprod.yaml";
APP_PRODUCTION_YAML="$(pwd)/app-production.yaml";

if [[ ! -f ${APP_PREPROD_YAML} || ! -f ${APP_PRODUCTION_YAML} ]]; then
    echo "##### Deployment configuration file not found #####".
    exit;
fi

APPLICATION_ID="search-and-filtering";
APPLICATION_NAME="Search and Filtering";
SLACK_URL="https://hooks.slack.com/services/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";

send_slack_notification()
{
    CURL_DATA='{
      "attachments": [
        {
          "color": "#36a64f",
          "pretext": ":white_check_mark: New version of '${APPLICATION_NAME}' has been deployed (currently receiving 0% traffic).",
          "fields": [
            {
              "title": "Version",
              "value": "'${BUILD_NO}'",
              "short": true
            },
            {
              "title": "Deployed to",
              "value": "'${PROJECT_ID}'",
              "short": true
            },
            {
              "title": "Deployed by",
              "value": "'${USER_NAME}'",
              "short": false
            }
          ]
        },
        {
          "color": "#36a64f",
          "title": "Go To Swagger Demo",
          "title_link": "https://'${APPLICATION_ID}'-dot-'${PROJECT_ID}'.appspot.com/api-docs/"
        },
        {
          "color": "#36a64f",
          "title": "Go To AppEngine/Versions",
          "title_link": "https://console.cloud.google.com/appengine/versions?cloudshell=false&project='${PROJECT_ID}'&serviceId='${APPLICATION_ID}'&versionssize=50"
        },
        {
          "color": "#36a64f",
          "title": "Go To Logging",
          "title_link": "https://console.cloud.google.com/logs/viewer?project='${PROJECT_ID}'&cloudshell=false&resource=gae_app%2Fmodule_id%2F'${APPLICATION_ID}'%2Fversion_id%2F'${BUILD_NO}'&minLogLevel=0&expandAll=false&timestamp=2020-03-24T06:53:51.705000000Z&customFacets=&limitCustomFacetWidth=true&dateRangeStart=2020-03-24T05:53:51.965Z&dateRangeEnd=2020-03-24T06:53:51.965Z&interval=PT1H&logName=projects%2F'${PROJECT_ID}'%2Flogs%2Fstdout&logName=projects%2F'${PROJECT_ID}'%2Flogs%2Fstderr&logName=projects%2F'${PROJECT_ID}'%2Flogs%2Fappengine.googleapis.com%252Frequest_log&scrollTimestamp=2020-03-24T06:44:24.109961000Z"
        },
        {
          "color": "#36a64f",
          "title": "Go To Github Repository",
          "title_link": "'${GITHUB_URL}'"
        }
      ]
    }';

    CURL_FORMATTED=`echo ${CURL_DATA} | tr '\n' ' '`;
    if [[ "${PROJECT_ID}" == "insight-timer-a1ac7" || "${PROJECT_ID}" == "insight-timer-preprod" ]]; then
        curl -X POST -H 'Content-type: application/json' --data "${CURL_FORMATTED}" ${SLACK_URL} ;
    fi
}

deploy_app(){
    if [[ "${PROJECT_ID}" == "insight-timer-a1ac7" ]]; then
      APP_YAML="${APP_PRODUCTION_YAML}";
      gcloud app deploy ${APP_YAML} \
        --project ${PROJECT_ID} \
        --no-promote --no-stop-previous-version \
        --version=${BUILD_NO}
      if [[ $? -eq 0 ]]; then
          send_slack_notification;
          echo "##### Deployment Successful. #####";
      else
          echo "##### Deployment Failed. #####";
      fi
    else
      APP_YAML="${APP_PREPROD_YAML}";
      gcloud app deploy ${APP_YAML} \
        --project ${PROJECT_ID} \
        --promote --stop-previous-version \
        --version=${BUILD_NO}
      if [[ $? -eq 0 ]]; then
          send_slack_notification;
          echo "##### Deployment Successful. #####";
      else
          echo "##### Deployment Failed. #####";
      fi
    fi
}

deploy_app_local(){
    if [[ "${PROJECT_ID}" == "insight-timer-a1ac7" ]]; then
      APP_YAML="${APP_PRODUCTION_YAML}";
      gcloud app deploy ${APP_YAML} \
        --project ${PROJECT_ID} \
        --no-promote --no-stop-previous-version \
        --version=${BUILD_NO}
      if [[ $? -eq 0 ]]; then
          send_slack_notification;
          echo "##### Deployment Successful. #####";
      else
          echo "##### Deployment Failed. #####";
      fi
    else
      APP_YAML="${APP_PREPROD_YAML}";
      gcloud app deploy ${APP_YAML} \
        --project ${PROJECT_ID} \
        --promote --stop-previous-version \
        --version=${BUILD_NO}
      if [[ $? -eq 0 ]]; then
          send_slack_notification;
          echo "##### Deployment Successful. #####";
      else
          echo "##### Deployment Failed. #####";
      fi
    fi
}

if [[ $# == 0 ]]; then
    gcloud projects list
    PROJECT_ID_DEFAULT='insight-timer-a1ac7';
    read -p "##### Please select GCP Project ####[ ${PROJECT_ID_DEFAULT}] : " PROJECT_ID;
    PROJECT_ID=${PROJECT_ID:-$PROJECT_ID_DEFAULT};
    echo "[Local] : Direct Deployment Using Local Source Code";
    echo "[gcr]   : Deployment Using GCR Image";
    DEPLOYMENT_TYPE_DEFAULT="gcr";
    read -p "##### Please select how you want to deploy #####[ ${DEPLOYMENT_TYPE_DEFAULT}] : " DEPLOYMENT_TYPE;
    DEPLOYMENT_TYPE=${DEPLOYMENT_TYPE:-$DEPLOYMENT_TYPE_DEFAULT};
    if [[ "${DEPLOYMENT_TYPE}" != "${DEPLOYMENT_TYPE_DEFAULT}" ]]; then
        USER_NAME=$(whoami);
        BUILD_NO=`manual-${USER_NAME}`;
        GITHUB_URL="https://github.com/Insight-Timer/app-engine-${APPLICATION_ID}";
        echo "##### Build and Test in Local Machine #####"
        npm run build;npm run test;
        deploy_app_local
    else
        BUILD_NO_DEFAULT='latest';
        gcloud container images list-tags gcr.io/${PROJECT_ID}/${APPLICATION_ID}
        read -p "##### Please select Build Image #####[${BUILD_NO_DEFAULT}] : " BUILD_NO;
        BUILD_NO=${BUILD_NO:-$BUILD_NO_DEFAULT};
        $(git fetch)
        USER_NAME=$(git show -s ${BUILD_NO} | grep Author | tr -d '\n');
        GITHUB_URL="https://github.com/Insight-Timer/app-engine-${APPLICATION_ID}/commits/${BUILD_NO}";
        deploy_app;
    fi
else
    echo "##### Automatic Deployment by Cloud Build using GCR Images. #####";
    PROJECT_ID=$1;
    BUILD_NO=$2;
    APPLICATION_ID=$3;
    USER_NAME=$(git show -s ${BUILD_NO} | grep Author | tr -d '\n');
    GITHUB_URL="https://github.com/Insight-Timer/app-engine-${APPLICATION_ID}/commits/${BUILD_NO}";
    deploy_app;
fi

exit;