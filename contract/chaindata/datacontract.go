/*
 * SPDX-License-Identifier: Apache-2.0
 */

package chaindata

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Contract chaincode that defines
// the logic for uploading and downloading test
// data
type Contract struct {
	contractapi.Contract
}

// Instantiate does nothing
func (c *Contract) Instantiate() {
	fmt.Println("Instantiated")
}

// Upload a new data item and stores it in the world state
func (c *Contract) Upload(ctx TransactionContextInterface,  dataTime string,dataContent string, uploader string) (*DataItem, error) {
	data := DataItem{DataTime: dataTime, Uploader: uploader}
	data.SetUploaded()

	err := ctx.GetDataList().AddData(&data)

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (c *Contract) DownloadAll(ctx TransactionContextInterface) ([]*DataItem, error) {
	resultsIterator, err := ctx.GetDataList().RangeData("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var dataItems []*DataItem

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var dataItem DataItem
		dataItem.SetDownloaded()
		err = json.Unmarshal(queryResponse.Value, &dataItem)
		if err != nil {
			return nil, err
		}
		dataItems = append(dataItems, &dataItem)

	}
	return dataItems, nil
}



// Download updates a data item status to be downloaded
func (c *Contract) Download(ctx TransactionContextInterface, uploader string, dataTime string, downloader string, downloadTime string) (*DataItem, error) {
	data, err := ctx.GetDataList().GetData(uploader, dataTime)

	if err != nil {
		return nil, err
	}
	data.SetDownloaded()

	return data, nil
}


