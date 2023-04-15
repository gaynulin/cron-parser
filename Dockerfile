FROM node:16

# Create app directory
WORKDIR /app

COPY *.json /app/
COPY src /app/src
COPY tests /app/tests

RUN npm i -g ts-node
RUN npm i

ENTRYPOINT echo 'COMMAND EXAMPLE:\n ts-node ./src/app.ts "*/5 2,4-7,3,17,*/3 1,12 * 1-5 /command"\n' && \
  ts-node ./src/app.ts "*/5 2,4-7,3,17,*/3 1,12 * 1-5 /command" && \
  echo '\n\n----------RUN TESTS:---------\nnpm test\n' && npm test && bash
#CMD ["/bin/bash"]
