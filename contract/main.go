/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	chaindata "github.com/mikufan/bc_application/contract/chaindata"
)

func main() {

	contract := new(chaindata.Contract)
	contract.TransactionContextHandler = new(chaindata.TransactionContext)
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
