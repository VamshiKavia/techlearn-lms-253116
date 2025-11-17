#!/bin/bash
cd /home/kavia/workspace/code-generation/techlearn-lms-253116/lms_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

