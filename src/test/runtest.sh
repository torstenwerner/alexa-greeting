#!/bin/bash

aws lambda invoke --function-name HalloGast --payload file://$PWD/HelloIntentFirst.json --region eu-west-1 /tmp/out01.json
aws lambda invoke --function-name HalloGast --payload file://$PWD/HelloIntentSecond.json --region eu-west-1 /tmp/out02.json
