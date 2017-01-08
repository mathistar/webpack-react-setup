import * as React from "react";
import RemoteApi from '../api/RemoteApi'
import {RemoteConstant} from "../api/RemoteConstant";
import ReactNode = React.ReactNode;

interface ICRSData {
  accountNo: number
  accountName: string
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
  pageCriteria?: IPageCriteria
}


interface IPageCriteria {
  page?: number
  size?: number
  sortColumn?: string
  sortOrder?: string
  filter?: string
  totalPage?: number
}

interface IPagination {
  current: number
  length: number
  end?: number
  onPageChange?: any
}

interface IHeaderProps {
  header: Array<string>
}

const Header: React.StatelessComponent<IDataState> = (heading) => (
  <thead>
  <tr>
    {heading.header.map((v, i) => (<td key={i}>{v}</td>))}
  </tr>
  </thead>
)

const Details: React.StatelessComponent<IDataState> = (details) => (
  <tbody>
  {details.data.map((row, i) => (
    <tr key={i}>
      {row.map((col, i) => (
        <td key={i}>{col}</td>
      ))}
    </tr>
  ))}
  </tbody>
)

const DataTables: React.StatelessComponent<IDataState> = (details) => (
  <div className="row">
    <div className="col-md-12">
      <table className="table table-responsive table-striped table-bordered lessMarginBottom">
        <Header header={details.header}/>
        <Details data={details.data}/>
      </table>
    </div>

  </div>
)

const Pagination: React.StatelessComponent<IPagination> = paging => {
  let pageDisplayArray: Array<string> = []
  let pageFunctionArray: Array<string> = []
  console.log(paging)
  let start = paging.current - Math.floor(paging.length / 2)
  start = start < 1 ? 1 : start

  for (let i = start; i <= paging.length; i++) {
    (paging.current == i) ? pageFunctionArray.push("active") :
      ( paging.end < i ? pageFunctionArray.push("disabled") : pageFunctionArray.push("") )
    pageDisplayArray.push(String(i))
  }

  return (
    <div className="row">
      <div className="col-md-3 col-md-offset-9 textAlignRight">
        <ul className="pagination lessMarginTopBottom">
          <li className={start==1?'disabled':''} onClick={paging.onPageChange}>
            <a href="#" aria-label="Previous">
              <span aria-hidden="true">{String.fromCharCode(171)}</span>
            </a>
          </li>
          {
            pageDisplayArray.map((value, key) => (
              <li key={key} className={pageFunctionArray[key]} onClick={paging.onPageChange}>
                <a href="#">{value}</a>
              </li>
            ))
          }
          <li className={paging.end - start < paging.length ?'disabled':''} onClick={paging.onPageChange}>
              <a href="#" aria-label="Next">
                <span aria-hidden="true">{String.fromCharCode(187)}</span>
              </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

function  clone (object:any) {
  return JSON.parse(JSON.stringify(object))
}

export default class DataGrid extends React.Component<any, IDataState> {

  constructor(props: any) {
    super(props)
    const pageCriteria: IPageCriteria = {page: 0, size: 10}
    this.state = {header: [], data: [], pageCriteria: pageCriteria}
    this.onPageChange = this.onPageChange.bind(this)
  }



  applyPagingCriteria(pageCriteria: IPageCriteria, fullData: Array<Array<string>>): Array<Array<string>> {
    let end = pageCriteria.page * pageCriteria.size
    let start = end - pageCriteria.size
    console.log(`page from ${start} to ${end}`)
    return fullData.slice(start, end)
  }

  onPageChange(event: React.ReactHTMLElement<HTMLAnchorElement>):void {
    const pageCriteria: IPageCriteria = clone(this.state.pageCriteria);
    console.log(`event value is ${event}`)

    // pageCriteria.page = pageNo
    // this.setState({pageCriteria})
  }

  componentWillMount() {
    const remoteApi = new RemoteApi();
    remoteApi.getData(RemoteConstant.CRSHeader).then(
      res => {
        this.setState({header: res.data as Array<string>})
      }
    )
    remoteApi.getData(RemoteConstant.CRSData).then(
      res => {
        const pageCriteria: IPageCriteria = clone(this.state.pageCriteria)
        pageCriteria.page = 1
        const fullData = res.data as Array<Array<string>>
        pageCriteria.totalPage = Math.ceil(fullData.length / pageCriteria.size)
        const filteredData = this.applyPagingCriteria(pageCriteria, fullData)
        this.setState({data: filteredData, pageCriteria})
      }
    )
  }

  render() {
    return (
      <div>
        <div className="container">
          <h1>CRS Search</h1>
          <DataTables header={this.state.header} data={this.state.data}/>
          <Pagination
            current={this.state.pageCriteria.page}
            length={3}
            end={this.state.pageCriteria.totalPage}
            onPageChange={ this.onPageChange }/>
        </div>
      </div>
    );
  }
}


