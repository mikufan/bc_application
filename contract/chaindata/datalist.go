package chaindata

import (
	ledgerapi "github.com/mikufan/bc_application/contract/ledger-api"
	"github.com/hyperledger/fabric-chaincode-go/shim"
)
// ListInterface defines functionality needed
// to interact with the world state
type ListInterface interface {
	AddData(*DataItem) error
	GetData(string, string) (*DataItem, error)
	UpdateData(*DataItem) error
	RangeData(string,string)(shim.StateQueryIteratorInterface, error)
}

type list struct {
	stateList ledgerapi.StateListInterface
}

func (dtl *list) AddData(data *DataItem) error {
	return dtl.stateList.AddState(data)
}

func (dtl *list) GetData(uploader string, dataTime string) (*DataItem, error) {
	dt := new(DataItem)

	err := dtl.stateList.GetState(CreateDataItemKey(uploader, dataTime), dt)

	if err != nil {
		return nil, err
	}

	return dt, nil
}

func (dtl *list) RangeData(startKey string,endKey string)(shim.StateQueryIteratorInterface, error){
	iterator,err := dtl.stateList.RangeState(startKey,endKey)
	return iterator,err
}

func (tdl *list) UpdateData(data *DataItem) error {
	return tdl.stateList.UpdateState(data)
}

// NewList create a new list from context
func newList(ctx TransactionContextInterface) *list {
	stateList := new(ledgerapi.StateList)
	stateList.Ctx = ctx
	stateList.Name = "org.datanet.dataitemlist"
	stateList.Deserialize = func(bytes []byte, state ledgerapi.StateInterface) error {
		return Deserialize(bytes, state.(*DataItem))
	}

	list := new(list)
	list.stateList = stateList

	return list
}
