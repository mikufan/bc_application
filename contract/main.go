/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main

import (
	"fmt"

	"./chaincode"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {

	contract := new(chaincode.dataContract)
	contract.TransactionContextHandler = new(chaincode.TransactionContext)
	contract.Name = "org.datanet.datacontract"
	contract.Info.Version = "0.0.1"

	chaincode, err := contractapi.NewChaincode(contract)

	if err != nil {
		panic(fmt.Sprintf("Error creating chaincode. %s", err.Error()))
	}

	chaincode.Info.Title = "TestDataChaincode"
	chaincode.Info.Version = "0.0.1"

	err = chaincode.Start()

	if err != nil {
		panic(fmt.Sprintf("Error starting chaincode. %s", err.Error()))
	}
}
