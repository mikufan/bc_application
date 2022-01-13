/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	//"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type DataItem struct {
	DataTime   string `json:"datatime"`
	DataContent  string `json:"datacontent"`
	Uploader string `json:"uploader"`
}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"Key"`
	Record *DataItem

}

// InitLedger adds a base set of cars to the ledger
// func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
// 	cars := []Car{
// 		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
// 		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
// 		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
// 		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
// 		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
// 		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
// 		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
// 		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
// 		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
// 		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
// 	}

// 	for i, car := range cars {
// 		carAsBytes, _ := json.Marshal(car)
// 		err := ctx.GetStub().PutState("CAR"+strconv.Itoa(i), carAsBytes)

// 		if err != nil {
// 			return fmt.Errorf("Failed to put to world state. %s", err.Error())
// 		}
// 	}

// 	return nil
// }

func (s *SmartContract) CreateDataItem(ctx contractapi.TransactionContextInterface, dataNumber string, dataTime string, dataContent string, uploader string) error {
	dataItem := DataItem{
		DataTime:  dataTime,
		DataContent:  dataContent,
		Uploader: uploader,
	}

	dataAsBytes, _ := json.Marshal(dataItem)

	return ctx.GetStub().PutState(dataNumber, dataAsBytes)
}

// QueryCar returns the car stored in the world state with given id
// func (s *SmartContract) QueryCar(ctx contractapi.TransactionContextInterface, carNumber string) (*Car, error) {
// 	carAsBytes, err := ctx.GetStub().GetState(carNumber)

// 	if err != nil {
// 		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
// 	}

// 	if carAsBytes == nil {
// 		return nil, fmt.Errorf("%s does not exist", carNumber)
// 	}

// 	car := new(Car)
// 	_ = json.Unmarshal(carAsBytes, car)

// 	return car, nil
// }


func (s *SmartContract) QueryAllDataItems(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	startKey := ""
	endKey := ""

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		dataItem := new(DataItem)
		_ = json.Unmarshal(queryResponse.Value, dataItem)

		queryResult := QueryResult{Key: queryResponse.Key, Record: dataItem}
		results = append(results, queryResult)
	}

	return results, nil
}

// ChangeCarOwner updates the owner field of car with given id in world state
// func (s *SmartContract) ChangeCarOwner(ctx contractapi.TransactionContextInterface, carNumber string, newOwner string) error {
// 	car, err := s.QueryCar(ctx, carNumber)

// 	if err != nil {
// 		return err
// 	}

// 	car.Owner = newOwner

// 	carAsBytes, _ := json.Marshal(car)

// 	return ctx.GetStub().PutState(carNumber, carAsBytes)
// }

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
