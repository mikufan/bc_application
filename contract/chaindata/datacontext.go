package chaindata

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// TransactionContextInterface an interface to
// describe the minimum required functions for
// a transaction context of test data
type TransactionContextInterface interface {
	contractapi.TransactionContextInterface
	GetDataList() ListInterface
}

// TransactionContext implementation of
// TransactionContextInterface for use with
// data contract
type TransactionContext struct {
	contractapi.TransactionContext
	dataList *list
}

// GetDataList return data list
func (tc *TransactionContext) GetDataList() ListInterface {
	if tc.dataList == nil {
		tc.dataList = newList(tc)
	}

	return tc.dataList
}
