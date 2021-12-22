package chaindata

import (
	"encoding/json"
	"fmt"

	ledgerapi "github.com/mikufan/bc_application/contract/ledger-api"
)

// State enum for data state
type State uint

const (
	// UPLOADED state for when a data item has been uploaded
	UPLOADED State = iota + 1
	// DOWNLOADED state for when a data item has been redeemed
	DOWNLOADED
)

func (state State) String() string {
	names := []string{"UPLOADED", "DOWNLOADED"}

	if state < UPLOADED || state > DOWNLOADED {
		return "UNKNOWN"
	}

	return names[state-1]
}

// CreateDataItemKey creates a key for data items
func CreateDataItemKey(uploader string, dataTime string) string {
	return ledgerapi.MakeKey(uploader, dataTime)
}

// Used for managing the fact status is private but want it in world state
type dataItemAlias DataItem
type jsonDataItem struct {
	*dataItemAlias
	State State  `json:"currentState"`
	Class string `json:"class"`
	Key   string `json:"key"`
}

// DataItem defines a data item
type DataItem struct {
	DataTime    string `json:"dataTime"`
	Uploader    string `json:"uploader"`
	DataContent string `json:"dataContent"`
	state       State  `metadata:"currentState"`
	class       string `metadata:"class"`
	key         string `metadata:"key"`
}

// UnmarshalJSON special handler for managing JSON marshalling
func (dt *DataItem) UnmarshalJSON(data []byte) error {
	jdt := jsonDataItem{dataItemAlias: (*dataItemAlias)(dt)}

	err := json.Unmarshal(data, &jdt)

	if err != nil {
		return err
	}

	dt.state = jdt.State

	return nil
}

// MarshalJSON special handler for managing JSON marshalling
func (dt DataItem) MarshalJSON() ([]byte, error) {
	jdt := jsonDataItem{dataItemAlias: (*dataItemAlias)(&dt), State: dt.state, Class: "org.datanet.dataitem", Key: ledgerapi.MakeKey(dt.Uploader, dt.DataTime)}

	return json.Marshal(&jdt)
}

// GetState returns the state
func (dt *DataItem) GetState() State {
	return dt.state
}

// SetUploaded returns the state to uploaded
func (dt *DataItem) SetUploaded() {
	dt.state = UPLOADED
}

// SetDownloaded sets the state to downloaded
func (dt *DataItem) SetDownloaded() {
	dt.state = DOWNLOADED
}

// IsUploaded returns true if state is uploaded
func (dt *DataItem) IsUploaded() bool {
	return dt.state == UPLOADED
}

// GetSplitKey returns values which should be used to form key
func (dt *DataItem) GetSplitKey() []string {
	return []string{dt.Uploader, dt.DataTime}
}

// Serialize formats the data items as JSON bytes
func (dt *DataItem) Serialize() ([]byte, error) {
	return json.Marshal(dt)
}

// Deserialize formats the data items from JSON bytes
func Deserialize(bytes []byte, dt *DataItem) error {
	err := json.Unmarshal(bytes, dt)

	if err != nil {
		return fmt.Errorf("Error deserializing data items. %s", err.Error())
	}

	return nil
}
