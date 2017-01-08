import * as React from "react";
import RemoteApi from '../api/RemoteApi'
import {RemoteConstant} from "../api/RemoteConstant";
import ReactNode = React.ReactNode;

interface ICRSData {
  accountNo: number
  accountName:string
  partyId: number
  partyName: string
  dateUpdated: string
  isTaxResidence: boolean
  countryResidence: string
}

interface ICRSHeader {
  heading: Array<string>
  type?: string
}

interface IDataState {
  header?: Array<string>,
  data?: Array<Array<string>>
}



export default class DataGrid extends React.Component<any, IDataState> {

  constructor(props: ReactNode) {
    super(props)
    this.state = {header: [], data: []}
  }

  componentWillMount() {
    const remoteApi = new RemoteApi();
    remoteApi.getData(RemoteConstant.CRSHeader).then(
      res => {
        this.setState({header:res.data as Array<string>})
      }
    )
    remoteApi.getData(RemoteConstant.CRSData).then(
      res => {
        this.setState({data:res.data as Array<Array<string>>})
      }
    )
  }



  render() {
    return (
      <div>
        <h1>CRS Search</h1>
        <div className="container-fluid">
          <div className="col-md-8 row">
            <table className="table table-responsive table-striped table-bordered">
              <thead>
              <tr>
                {this.state.header.map(v => (<td>{v}</td>))}
              </tr>
              </thead>
              <tbody>
              {this.state.data.map(row => (
                <tr>
                  {row.map(col => (
                    <td>{col}</td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>

          </div>
          <div className="row">

          </div>
        </div>
      </div>
    );
  }
}


