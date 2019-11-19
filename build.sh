#!/bin/sh

set -e
set -x

GIT_TAG="$(git tag --points-at | head -n 1)"
if [ -n "${GIT_REV}" ]; then
	LABEL_GIT_TAG="--label \"org.opencontainers.image.version=${GIT_TAG}\""
fi
DATE="$(date --iso-8601=seconds)"
LABEL_DATE="--label \"org.opencontainers.image.created=${DATE}\""
GIT_REV="$(git rev-parse HEAD)"
LABEL_GIT_REV="--label \"org.opencontainers.image.revision=${GIT_REV}\""

docker build -t cloudstack-primate ${LABEL_DATE} ${LABEL_GIT_REV} ${LABEL_GIT_TAG} .