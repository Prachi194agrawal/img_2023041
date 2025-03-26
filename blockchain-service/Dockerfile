FROM hyperledger/fabric-peer:2.3

WORKDIR /chaincode

# Install chaincode dependencies
COPY chaincode/package.json .
RUN npm install

# Copy chaincode
COPY chaincode/. .

# Environment variables
ENV CORE_CHAINCODE_ID_NAME=frauddetect:1.0
ENV CORE_PEER_ADDRESS=peer0.org1.example.com:7051

CMD ["node", "chaincode.js"]
