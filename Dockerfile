#FROM registry.arangodb.com/arangodb/arangodb-mesos:3.1.rc2-preview-enterprise
FROM registry.arangodb.com/arangodb/arangodb-mesos:3.1-devel-preview-enterprise
MAINTAINER Max Neunhoeffer <max@arangodb.com>
COPY dowork.sh /dowork.sh
COPY dowork.js /dowork.js
